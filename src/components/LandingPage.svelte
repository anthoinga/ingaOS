<script module lang="ts">
  export const REVEAL_MS = 850
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { cn } from '@/lib/utils'
  import { startIdleLoop, setMuffled } from '@/effects/soundEngine'
  import { t } from '@/lib/i18n.svelte'

  interface Props {
    isRevealing: boolean
    isHovered: boolean
  }

  let { isRevealing, isHovered }: Props = $props()

  let canvas: HTMLCanvasElement = $state()
  let isPeelingIn = $state(true)
  
  const useFallback = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const clickPos = new Float32Array(20).fill(-1.0)
  const clickTimes = new Float32Array(10).fill(0.0)
  let clickIndex = 0
  let startTime = 0

  const VERT = `#version 300 es
  in vec2 a_pos;
  out vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
  `

  const FRAG = `#version 300 es
  precision highp float;

  in vec2 v_uv;
  out vec4 fragColor;

  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uPixelSize;

  const int MAX_CLICKS = 10;
  uniform vec2 uClickPos[MAX_CLICKS];
  uniform float uClickTimes[MAX_CLICKS];

  float Bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x / 2. + a.y * a.y * .75);
  }

  #define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
  #define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

  #define FBM_OCTAVES     5
  #define FBM_LACUNARITY  1.25
  #define FBM_GAIN        1.
  #define FBM_SCALE       4.0          // master scale for uv

  float hash11(float n) { return fract(sin(n)*43758.5453); }

  float vnoise(vec3 p)
  {
      vec3 ip = floor(p);
      vec3 fp = fract(p);

      float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
      float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
      float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
      float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
      float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
      float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
      float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
      float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));

      vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);   // smootherstep

      float x00 = mix(n000, n100, w.x);
      float x10 = mix(n010, n110, w.x);
      float x01 = mix(n001, n101, w.x);
      float x11 = mix(n011, n111, w.x);

      float y0  = mix(x00, x10, w.y);
      float y1  = mix(x01, x11, w.y);

      return mix(y0, y1, w.z) * 2.0 - 1.0;         // [-1,1]
  }

  float fbm2(vec2 uv, float t)
  {
      vec3 p   = vec3(uv * FBM_SCALE, t);
      float amp  = 1.;
      float freq = 1.;
      float sum  = 1.;

      for (int i = 0; i < FBM_OCTAVES; ++i)
      {
          sum  += amp * vnoise(p * freq);
          freq *= FBM_LACUNARITY;
          amp  *= FBM_GAIN;
      }
      
      return sum * 0.5 + 0.5;   // [0,1]
  }

  float maskTriangle(vec2 p, vec2 id, float cov) {
      bool flip = mod(id.x + id.y, 2.0) > 0.5;
      if (flip) p.x = 1.0 - p.x;
      float r = sqrt(cov);
      float d  = p.y - r*(1.0 - p.x);   // signed distance to the edge
      float aa = fwidth(d);             // analytic pixel width
      return cov * clamp(0.5 - d/aa, 0.0, 1.0);
  }

  void main() {
      float pixelSize = uPixelSize;
      vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
      float aspectRatio = uResolution.x / uResolution.y;

      vec2 pixelId = floor(fragCoord / pixelSize);
      vec2 pixelUV = fract(fragCoord / pixelSize); 

      float cellPixelSize = 8. * pixelSize; // 8x8 Bayer matrix
      vec2 cellId = floor(fragCoord / cellPixelSize);
      vec2 cellCoord = cellId * cellPixelSize;
      
      vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

      /* Animated fbm feed */
      vec2 normCoord = cellCoord / uResolution + 0.5;
      float diagonal = (normCoord.x + (1.0 - normCoord.y)) * 0.5;
      float feed = fbm2(uv, uTime * 0.05);
      // Apply diagonal gradient weight (sparse top-left, dense bottom-right)
      feed = feed * 0.5 - 0.65 + (diagonal - 0.5) * 0.50;

      /* Ripple clicks */
      const float speed     = 0.30;
      const float thickness = 0.10;
      const float dampT     = 1.0;
      const float dampR     = 10.0;

      for (int i = 0; i < MAX_CLICKS; ++i) {
          vec2 pos = uClickPos[i];
          if (pos.x < 0.0) continue;

          vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / uResolution)) * vec2(aspectRatio, 1.0);

          float t = max(uTime - uClickTimes[i], 0.0);
          float r = distance(uv, cuv);

          float waveR = speed * t;
          float ring  = exp(-pow((r - waveR) / thickness, 2.0));
          float atten = exp(-dampT * t) * exp(-dampR * r);
          feed = max(feed, ring * atten);
      }

      float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
      float bw    = step(0.5, feed + bayer);

      float M = maskTriangle(pixelUV, pixelId, bw);
      vec3 bgColor = vec3(12.0 / 255.0, 11.0 / 255.0, 10.0 / 255.0);
      vec3 col = mix(bgColor, uColor, M);
      fragColor = vec4(col, 1.0);
  }
  `

  function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    return shader
  }

  const BACKDROP_RGB: [number, number, number] = [0.20, 0.19, 0.18]
  const SHADER_PIXEL_SIZE = 6.0

  function handlePointerDown(e: PointerEvent) {
    setMuffled(true)
    startIdleLoop()
    if (useFallback || !canvas) return
    const rect = canvas.getBoundingClientRect()
    
    const fx = (e.clientX - rect.left) * (canvas.width / rect.width)
    const fy = (rect.height - (e.clientY - rect.top)) * (canvas.height / rect.height)

    clickPos[clickIndex * 2] = fx
    clickPos[clickIndex * 2 + 1] = fy
    clickTimes[clickIndex] = (performance.now() - startTime) / 1000
    clickIndex = (clickIndex + 1) % 10
  }

  let raf = 0
  let ro: ResizeObserver

  onMount(() => {
    setTimeout(() => {
      isPeelingIn = false
    }, 50)

    setMuffled(true)
    startIdleLoop()

    const initAudio = () => {
      setMuffled(true)
      startIdleLoop()
      window.removeEventListener('pointerdown', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
    window.addEventListener('pointerdown', initAudio)
    window.addEventListener('keydown', initAudio)

    if (!useFallback && canvas) {
      const gl = canvas.getContext('webgl2', { alpha: false, antialias: false })
      if (gl) {
        const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
        const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
        const prog = gl.createProgram()!
        gl.attachShader(prog, vert)
        gl.attachShader(prog, frag)
        gl.linkProgram(prog)
        gl.useProgram(prog)

        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

        const aPos = gl.getAttribLocation(prog, 'a_pos')
        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

        const uColor = gl.getUniformLocation(prog, 'uColor')
        const uResolution = gl.getUniformLocation(prog, 'uResolution')
        const uTime = gl.getUniformLocation(prog, 'uTime')
        const uPixelSize = gl.getUniformLocation(prog, 'uPixelSize')
        const uClickPos = gl.getUniformLocation(prog, 'uClickPos')
        const uClickTimes = gl.getUniformLocation(prog, 'uClickTimes')

        startTime = performance.now()

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = canvas.offsetWidth * dpr
          canvas.height = canvas.offsetHeight * dpr
          gl.viewport(0, 0, canvas.width, canvas.height)
        }
        resize()
        
        ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const draw = () => {
          const now = (performance.now() - startTime) / 1000
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          gl.uniform1f(uTime, now)
          gl.uniform3fv(uColor, BACKDROP_RGB)
          gl.uniform2f(uResolution, canvas.width, canvas.height)
          gl.uniform1f(uPixelSize, SHADER_PIXEL_SIZE * dpr)

          gl.uniform2fv(uClickPos, clickPos)
          gl.uniform1fv(uClickTimes, clickTimes)

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
          raf = requestAnimationFrame(draw)
        }
        raf = requestAnimationFrame(draw)

        return () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          gl.deleteProgram(prog)
          gl.deleteBuffer(buf)
          window.removeEventListener('pointerdown', initAudio)
          window.removeEventListener('keydown', initAudio)
        }
      }
    }

    return () => {
      window.removeEventListener('pointerdown', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
  })

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf)
    if (ro) ro.disconnect()
  })
</script>

<div
  onpointerdown={handlePointerDown}
  role="presentation"
  class={cn(
    'fixed inset-0 z-50 flex bg-[#0c0b0a] overflow-hidden select-none',
    'transition-all ease-[cubic-bezier(0.76,0,0.24,1)]'
  )}
  style:transition-duration={(isRevealing || isPeelingIn) ? `${REVEAL_MS}ms` : '300ms'}
  style:clip-path={(isRevealing || isPeelingIn)
    ? 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%)'
    : isHovered
      ? 'polygon(0% 0%, calc(100% - 176px) 0%, 100% 176px, 100% 100%, 0% 100%)'
      : 'polygon(0% 0%, calc(100% - 128px) 0%, 100% 128px, 100% 100%, 0% 100%)'}
>
  {#if !useFallback}
    <canvas
      bind:this={canvas}
      class="absolute inset-0 w-full h-full z-0 block"
    ></canvas>
  {:else}
    <div
      class="absolute inset-0 z-0"
      style:background="linear-gradient(160deg, #131210 0%, #0c0b0a 100%)"
    ></div>
  {/if}

  <!-- Dog-ear fold corner sheet -->
  <div class="absolute top-0 right-0 w-56 h-56 z-40 pointer-events-none flex items-start justify-end">
    <button
      class={cn(
        "relative cursor-default focus:outline-none overflow-hidden transition-all ease-[cubic-bezier(0.76,0,0.24,1)]",
        isHovered ? 'w-44 h-44' : 'w-32 h-32'
      )}
      style:transition-duration={(isRevealing || isPeelingIn) ? `${REVEAL_MS}ms` : '300ms'}
      style:transform={(isRevealing || isPeelingIn) ? 'translate(-120vw, 120vh)' : 'translate(0, 0)'}
      aria-label="Reveal main site"
      tabindex="-1"
    >
      <div
        class="absolute top-0 right-0 w-full h-full shadow-[-4px_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300"
        style:background="linear-gradient(225deg, #1c1a17 0%, #131210 50%, #22201d 100%)"
        style:clip-path="polygon(0 0, 100% 100%, 0 100%)"
      ></div>
      <div
        class="absolute top-0 left-0 w-[141.4%] h-[1px] bg-white/20 origin-top-left rotate-45 transform transition-colors duration-300 pointer-events-none"
      ></div>
    </button>
  </div>

  <div class="relative z-10 flex flex-col justify-between items-start w-full h-full pt-16 pb-16 px-12 md:px-24">
    <div class="font-mono text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)] opacity-90 select-none">
      inga.dev
    </div>

    <div class="my-auto max-w-4xl">
      <h1 class="text-3xl md:text-5xl font-sans font-light tracking-tight text-[var(--text-primary)] text-left leading-[1.15]">
        {t('landing.hero')} 
        <a
          href="https://www.persimmony.com"
          target="_blank"
          rel="noopener noreferrer"
          class="relative inline-block mt-2 md:mt-0 hover:text-[var(--accent-lime)] transition-colors duration-150"
        >
          @Persimmony
          <span class="absolute bottom-[-4px] md:bottom-[-6px] left-0 right-0 h-[1px] bg-current"></span>
        </a>
      </h1>
    </div>

    <div class="flex flex-col gap-2.5 font-mono text-sm text-white text-left">
      <div class="inline-flex items-center gap-2 w-fit opacity-50">
        <span class="text-xl leading-none w-4 h-4 flex items-center justify-center select-none translate-y-[3px]">☀</span>
        <span class="font-semibold">ingaOS v0.1.0</span>
      </div>
      <a
        href="mailto:anthony@inga.dev"
        class="inline-flex items-center gap-2 hover:text-[var(--accent-orange)] transition-colors duration-150 w-fit"
      >
        <!-- Inline Mail Icon -->
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span>anthony@inga.dev</span>
      </a>
      <a
        href="https://portfolio.inga.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 hover:text-[var(--accent-green)] transition-colors duration-150 w-fit"
      >
        <!-- Inline Globe Icon -->
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span>portfolio.inga.dev</span>
      </a>
      <a
        href="https://github.com/anthoinga"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 hover:text-[var(--accent-purple)] transition-colors duration-150 w-fit"
      >
        <!-- Inline Github Icon -->
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span>github.com/anthoinga</span>
      </a>
      <a
        href="https://linkedin.com/in/anthonyinga"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 hover:text-[var(--accent-blue)] transition-colors duration-150 w-fit"
      >
        <!-- Inline Linkedin Icon -->
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        <span>linkedin.com/anthonyinga</span>
      </a>
    </div>
  </div>
</div>
