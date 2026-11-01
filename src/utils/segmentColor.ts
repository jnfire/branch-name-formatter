const PALETTE_SIZE = 6;

/** CSS color of the n-th field of a format: `--seg-1` to `--seg-6`, cycling. */
export const segmentColor = (index: number): string => `var(--seg-${(index % PALETTE_SIZE) + 1})`;
