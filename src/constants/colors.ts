export const COLORS = {
  orange: '#FF6B2B',
  orangeHover: '#e55a1f',
  green: '#00A878',
  greenHover: '#009969',
  blue: '#0099E6',
  red: '#ef4444',
  redHover: '#dc2626',
} as const;

export const PLAYER_COLORS = [
  '#FF6B2B',
  '#0099E6',
  '#EF0097',
  '#8B2FD4',
  '#00B4A6',
  '#00A878',
  '#F5C518',
] as const;

export const playerColor = (index: number) => PLAYER_COLORS[index % PLAYER_COLORS.length];
