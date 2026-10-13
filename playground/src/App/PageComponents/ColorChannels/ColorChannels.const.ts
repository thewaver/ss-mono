import { Color } from "@thewaver/ss-utils";

export const SPACES: Color.ValueSpace[] = ["rgba", "hsla", "hexa"];

export const RGB_CHANNELS = ["r", "g", "b"] as const;

export const HSL_CHANNELS = ["s", "l"] as const;

export const CHANNEL_FIELD_WIDTH = 76;

export const HEX_FIELD_WIDTH = 150;

export const CHANNEL_MAX = 255;

export const HUE_MAX = 360;

export const PERCENT = 100;

export const ALPHA_STEP = 0.01;

export const ALPHA_MAX = 1;
