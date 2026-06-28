import { useEffect, useRef } from 'react'

function useStaticFallback(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return reduced || coarse
}

// Vertex shader — passes UV coords through
const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

// Fragment shader — animated flowing gradient
const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;

// Simplex-like smooth noise
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

void main() {
  vec2 uv = v_uv;

  // Layered noise for organic flow
  float n1 = noise(uv * 2.5 + vec2(u_time * 0.08, u_time * 0.05));
  float n2 = noise(uv * 4.0 - vec2(u_time * 0.06, u_time * 0.04));
  float wave = n1 * 0.6 + n2 * 0.4;

  // Vira Sand palette: dark base with accent teal
  vec3 base  = vec3(0.075, 0.071, 0.063);  // --bg-primary #131210
  vec3 surf  = vec3(0.110, 0.102, 0.090);  // --bg-surface #1c1a17
  vec3 raise = vec3(0.243, 0.227, 0.196);  // --bg-raised #3E3A32
  vec3 teal  = vec3(0.502, 0.796, 0.769);  // --accent    #80CBC4

  // Blend layers driven by wave + vertical gradient
  float grad = 1.0 - uv.y;
  vec3 col = mix(base, surf, wave * 0.6 + grad * 0.2);
  col = mix(col, raise, wave * 0.15);
  // Subtle teal shimmer near top
  col = mix(col, teal * 0.25, smoothstep(0.6, 1.0, wave) * (1.0 - uv.y) * 0.3);

  gl_FragColor = vec4(col, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const useFallback = useStaticFallback()

  useEffect(() => {
    if (useFallback) return
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')

    let raf = 0
    let start = performance.now()

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
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
  }, [useFallback])

  if (useFallback) {
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(160deg, var(--bg-raised) 0%, var(--bg-surface) 40%, var(--bg-primary) 100%)',
        }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
