<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { type ShaderColors } from './waveColors'

  interface Props {
    targetColors: ShaderColors
  }

  let { targetColors }: Props = $props()

  let canvas: HTMLCanvasElement = $state()
  let ro: ResizeObserver

  const useFallback = typeof window !== 'undefined'
    ? (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches)
    : false

  const VERT = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
  `

  const FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec3 u_col_base;
  uniform vec3 u_col_surf;
  uniform vec3 u_col_raise;
  uniform vec3 u_col_accent;
  
  const float waveWidthFactor = 1.5;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float calcSineMask(
  	vec2 uv,
  	float speed,
  	float frequency,
  	float amplitude,
  	float phaseShift,
  	float verticalOffset,
  	float lineWidth,
  	float sharpness,
  	bool invertFalloff
  ) {
  	float angle = u_time * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
  	float waveY = sin(angle) * amplitude + verticalOffset;
  	float deltaY = waveY - uv.y;
  	float distanceVal  = distance(waveY , uv.y);
  
  	if (invertFalloff) {
  		if (deltaY > 0.0) {
  			distanceVal = distanceVal * 4.0;
  		}
  	} else {
  		if (deltaY < 0.0) {
  			distanceVal = distanceVal * 4.0;
  		}
  	}
  
  	float smoothVal = smoothstep(lineWidth * waveWidthFactor, 0.0, distanceVal);
  	return pow(smoothVal, sharpness);
  }
  
  float getWaveMask(vec2 uv) {
    float wave = 0.0;
    wave += calcSineMask(uv, 0.2, 0.20, 0.20, 0.0, 0.5, 0.10, 15.0, false);
    wave += calcSineMask(uv, 0.4, 0.40, 0.15, 0.0, 0.5, 0.10, 17.0, false);
    wave += calcSineMask(uv, 0.3, 0.60, 0.15, 0.0, 0.5, 0.05, 23.0, false);
    wave += calcSineMask(uv, 0.1, 0.26, 0.07, 0.0, 0.3, 0.10, 17.0, true);
    wave += calcSineMask(uv, 0.3, 0.36, 0.07, 0.0, 0.3, 0.10, 17.0, true);
    wave += calcSineMask(uv, 0.5, 0.46, 0.07, 0.0, 0.3, 0.05, 23.0, true);
    wave += calcSineMask(uv, 0.2, 0.58, 0.05, 0.0, 0.3, 0.20, 15.0, true);
    return wave;
  }
  
  void main() {
    vec2 uv = v_uv;
    
    // 1. Calculate original noise background
    float n1 = noise(uv * 2.5 + vec2(u_time * 0.08, u_time * 0.05));
    float n2 = noise(uv * 4.0 - vec2(u_time * 0.06, u_time * 0.04));
    float noiseWave = n1 * 0.6 + n2 * 0.4;
  
    float grad = 1.0 - uv.y;
    vec3 baseBg = mix(u_col_base, u_col_surf, noiseWave * 0.7 + grad * 0.3);
    baseBg = mix(baseBg, u_col_raise, noiseWave * 0.35);
    baseBg = mix(baseBg, u_col_accent, smoothstep(0.5, 1.0, noiseWave) * 0.35);
    
    // 2. Calculate subtle PSP ribbon waves
    float ribbon = getWaveMask(uv);
    
    // 3. Layer the ribbons softly on top of the original background
    vec3 col = mix(baseBg, u_col_accent, clamp(ribbon * 0.06, 0.0, 1.0));
    
    gl_FragColor = vec4(col, 1.0);
  }
  `

  function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    return shader
  }

  let raf = 0

  onMount(() => {
    if (useFallback || !canvas) return

    const currentColors = {
      base: [...targetColors.base] as [number, number, number],
      surf: [...targetColors.surf] as [number, number, number],
      raise: [...targetColors.raise] as [number, number, number],
      accent: [...targetColors.accent] as [number, number, number]
    }

    const gl = canvas.getContext('webgl')
    if (!gl) return

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

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uColBase = gl.getUniformLocation(prog, 'u_col_base')
    const uColSurf = gl.getUniformLocation(prog, 'u_col_surf')
    const uColRaise = gl.getUniformLocation(prog, 'u_col_raise')
    const uColAccent = gl.getUniformLocation(prog, 'u_col_accent')

    const start = performance.now()

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()

    ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const lerp = (startVal: number, endVal: number, amt: number) => {
      return (1 - amt) * startVal + amt * endVal
    }

    const draw = () => {
      const speed = 0.03 // Lerp speed per frame

      for (let i = 0; i < 3; i++) {
        currentColors.base[i] = lerp(currentColors.base[i], targetColors.base[i], speed)
        currentColors.surf[i] = lerp(currentColors.surf[i], targetColors.surf[i], speed)
        currentColors.raise[i] = lerp(currentColors.raise[i], targetColors.raise[i], speed)
        currentColors.accent[i] = lerp(currentColors.accent[i], targetColors.accent[i], speed)
      }

      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform3fv(uColBase, currentColors.base)
      gl.uniform3fv(uColSurf, currentColors.surf)
      gl.uniform3fv(uColRaise, currentColors.raise)
      gl.uniform3fv(uColAccent, currentColors.accent)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  })

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf)
    if (ro) ro.disconnect()
  })

  // Static fallback colors — 1.5× boosts the normalized (0–1) palette values to CSS-visible
  // brightness, since the shader's own tone-mapping would have done this in WebGL
  const toRgb = (vec: [number, number, number]) => {
    return `rgb(${Math.round(vec[0] * 255 * 1.5)}, ${Math.round(vec[1] * 255 * 1.5)}, ${Math.round(vec[2] * 255 * 1.5)})`
  }
  
  let baseCss = $derived(toRgb(targetColors.base))
  let surfCss = $derived(toRgb(targetColors.surf))
  let accentCss = $derived(toRgb(targetColors.accent))
</script>

{#if useFallback}
  <div
    class="absolute inset-0 z-0 transition-all duration-[1000ms] ease-out"
    style:background="linear-gradient(160deg, {accentCss} 0%, {surfCss} 40%, {baseCss} 100%)"
  ></div>
{:else}
  <canvas
    bind:this={canvas}
    class="absolute inset-0 z-0 w-full h-full block"
  ></canvas>
{/if}
