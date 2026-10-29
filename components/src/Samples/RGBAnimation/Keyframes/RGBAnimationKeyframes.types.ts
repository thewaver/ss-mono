import type { RGBAnimationChannel } from "../../../Exotics/Animations/RGBAnimation/RGBAnimation.types";

export type RGBAnaglyphOpts = { separationPercent: number };

export type RGBEchoOpts = { distancePercent: number };

export type RGBFocusPullOpts = { maxBlurPx: number };

export type RGBHueSwapOpts = { turns: number; anchor: RGBAnimationChannel };

export type RGBOrbitOpts = { radiusPercent: number };

export type RGBSwellOpts = { scalePercent: number };

export type RGBTiltOpts = { maxDegrees: number };

export type RGBTwistOpts = { maxDegrees: number };
