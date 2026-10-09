// Shared by the noise-based reveals (TurbulentDissolve, the seeping chart text).
// fractalNoise luminance sits in a narrow band (about 0.33-0.5); this colour matrix
// stretches it to 0-1 and writes it into alpha, so a threshold can sweep it evenly.
const STRETCH = 6;
const LUMA_FLOOR = 0.33;

export const NOISE_TO_ALPHA = `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${0.2125 * STRETCH} ${0.7154 * STRETCH} ${0.0721 * STRETCH} 0 ${-LUMA_FLOOR * STRETCH}`;

// The exact complement (1 - the alpha above): with the threshold negated, a layer masked with
// this shows precisely the pixels the NOISE_TO_ALPHA layer hides, so the two can swap
export const NOISE_TO_INVERTED_ALPHA = `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-0.2125 * STRETCH} ${-0.7154 * STRETCH} ${-0.0721 * STRETCH} 0 ${1 + LUMA_FLOOR * STRETCH}`;
