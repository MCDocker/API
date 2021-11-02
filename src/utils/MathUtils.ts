export const clamp = (num, min, max) => (!Number.isNaN(Math.min(Math.max(num, min), max)) ? Math.min(Math.max(num, min), max) : max);
