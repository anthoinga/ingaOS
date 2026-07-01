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
