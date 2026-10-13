import * as styles from "./ProgressRing.css";

export const PERCENT = 100;

export const HALF = 0.5;

export const INDETERMINATE_ARC = 0.25;

export const RADIUS = (styles.RING_SIZE - styles.RING_STROKE) * HALF;

export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
