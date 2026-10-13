import type { PageWheelPipSide } from "./WheelContent.types";

import * as styles from "./WheelContent.css";

export const LABEL_TYPE_RATIO = 0.14;

export const NO_TILT = 0;

export const HALF = 0.5;

export const QUARTER_TURN = 90;

export const UPSIDE_DOWN_FROM = 90;

export const UPSIDE_DOWN_TO = 270;

export const HALF_TURN = 180;

export const FULL_TURN = 360;

export const PIP_PATH = "M 2 2 H 18 L 10 18 Z";

export const PIP_SIDE_STYLES: Record<PageWheelPipSide, string> = {
    top: styles.wheelPipTop,
    left: styles.wheelPipLeft,
};
