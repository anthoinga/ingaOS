import { useEffect, useRef } from 'react'

export interface ShaderColors {
  base: [number, number, number]
  surf: [number, number, number]
  raise: [number, number, number]
  accent: [number, number, number]
}

export const CRIMSON: ShaderColors = {
  base: [0.100, 0.025, 0.025],
  surf: [0.180, 0.045, 0.045],
  raise: [0.380, 0.080, 0.080],
  accent: [0.850, 0.120, 0.120]
}

export const GREEN: ShaderColors = {
  base: [0.025, 0.100, 0.025],
  surf: [0.045, 0.180, 0.045],
  raise: [0.080, 0.380, 0.080],
  accent: [0.120, 0.850, 0.120]
}

export const PURPLE: ShaderColors = {
  base: [0.060, 0.025, 0.100],
  surf: [0.100, 0.045, 0.180],
  raise: [0.220, 0.080, 0.380],
  accent: [0.600, 0.120, 0.850]
}

export const CYAN: ShaderColors = {
  base: [0.025, 0.080, 0.100],
  surf: [0.045, 0.130, 0.180],
  raise: [0.080, 0.260, 0.380],
  accent: [0.120, 0.650, 0.850]
}

export const ORANGE: ShaderColors = {
  base: [0.100, 0.050, 0.025],
  surf: [0.180, 0.100, 0.045],
  raise: [0.380, 0.200, 0.080],
  accent: [0.850, 0.480, 0.120]
}

export const BLUE: ShaderColors = {
  base: [0.025, 0.050, 0.100],
  surf: [0.045, 0.080, 0.180],
  raise: [0.080, 0.170, 0.380],
  accent: [0.120, 0.260, 0.850]
}

export const YELLOW: ShaderColors = {
  base: [0.100, 0.090, 0.025],
  surf: [0.180, 0.150, 0.045],
  raise: [0.380, 0.320, 0.080],
  accent: [0.850, 0.720, 0.120]
}

function useStaticFallback(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return reduced || coarse
}

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

interface Props {
  targetColors: ShaderColors
}

export function WaveBackground({ targetColors }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const useFallback = useStaticFallback()

  const targetColorsRef = useRef(targetColors)
  useEffect(() => {
    targetColorsRef.current = targetColors
  }, [targetColors])

  const currentColors = useRef<ShaderColors>({
    base: [...targetColors.base] as [number, number, number],
    surf: [...targetColors.surf] as [number, number, number],
    raise: [...targetColors.raise] as [number, number, number],
    accent: [...targetColors.accent] as [number, number, number]
  })

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

    let raf = 0
    const start = performance.now()

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const lerp = (startVal: number, endVal: number, amt: number) => {
      return (1 - amt) * startVal + amt * endVal
    }

    const draw = () => {
      const target = targetColorsRef.current
      const speed = 0.03 // Lerp speed per frame for smooth transition (~500ms)

      for (let i = 0; i < 3; i++) {
        currentColors.current.base[i] = lerp(currentColors.current.base[i], target.base[i], speed)
        currentColors.current.surf[i] = lerp(currentColors.current.surf[i], target.surf[i], speed)
        currentColors.current.raise[i] = lerp(currentColors.current.raise[i], target.raise[i], speed)
        currentColors.current.accent[i] = lerp(currentColors.current.accent[i], target.accent[i], speed)
      }

      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform3fv(uColBase, currentColors.current.base)
      gl.uniform3fv(uColSurf, currentColors.current.surf)
      gl.uniform3fv(uColRaise, currentColors.current.raise)
      gl.uniform3fv(uColAccent, currentColors.current.accent)

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
    const toRgb = (vec: [number, number, number]) => {
      return `rgb(${Math.round(vec[0] * 255 * 1.5)}, ${Math.round(vec[1] * 255 * 1.5)}, ${Math.round(vec[2] * 255 * 1.5)})`
    }
    const baseCss = toRgb(targetColors.base)
    const surfCss = toRgb(targetColors.surf)
    const accentCss = toRgb(targetColors.accent)

    return (
      <div
        className="absolute inset-0 -z-10 transition-all duration-[1000ms] ease-out"
        style={{
          background: `linear-gradient(160deg, ${accentCss} 0%, ${surfCss} 40%, ${baseCss} 100%)`,
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
