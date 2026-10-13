import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { SVGDefsColors } from "../../SVGDefs.types";
import { TrackedGradientDefaults } from "../TrackedGradient.const";

export namespace HandTrailConst {
    export const SWEEP_SPAN: Size2d = { width: 0.7, height: 0.7 };
    export const QUARTER_TURN = 90;
    export const HALF_TURN = 180;
    export const FULL_TURN = 360;
    export const MOTION_TURN_DEGREES = 0.25;
    export const RESTING_ANGLE = 0;
}

export namespace SpotConst {
    export const MOTION_STEP_RATIO = 0.002;
    export const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
}

export namespace SpotFlareConst {
    export const DISC_STOPS = [45, 78];
    export const DISC_ALPHA_RATIOS = [1, 0.3];
    export const RING_STOPS = [55, 82, 92];
    export const RING_ALPHA_RATIOS = [0.12, 1, 0.2];
}

export namespace SpotRippleConst {
    export const RIPPLE_LIFETIME_MS = 700;
    export const CREST_OUTER_LIMIT = 99;
    export const NO_TRAVEL = 0;
    export const FIRST_MILESTONE = 0;
}

export namespace SpotSmearConst {
    export const RESTING_HEADING = 0;
    export const NO_STRETCH = 1;
    export const NO_SPEED = 0;
}

export namespace TrackedGradientSampleConst {
    export const FULL_AGE_RATIO = 1;
    export const NO_FADE = 0;
    export const RENDERED_ELSEWHERE = () => undefined;
}

export namespace TrailStampConst {
    export const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
    export const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
    export const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
    export const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;
    export const FULL_ALPHA = 1;
}

export namespace Band1Const {
    export const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };
    export const DEFAULTS = TrackedGradientDefaults.BAND_DEFAULTS;
}

export namespace Band1v1Const {
    export const BAND_SPAN: Size2d = { width: 0.7, height: 0.7 };
    export const DEFAULTS = TrackedGradientDefaults.BAND_BLEND_DEFAULTS;
}

export namespace BandDiag1Const {
    export const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };
    export const DEFAULTS = TrackedGradientDefaults.BAND_DIAGONAL_DEFAULTS;
}

export namespace CometConst {
    export const PACE_BY_COMET = [1, 0.7, 0.5];
    export const SETTLE_MS = 1500;
    export const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    export const STILL: Point2d = { x: 0, y: 0 };
    export const CYCLING_DEFAULTS = TrackedGradientDefaults.COMET_CYCLING_DEFAULTS;
}

export namespace Hand1Const {
    export const QUARTER_TURN = 90;
    export const HALF_TURN = 180;
    export const DEFAULTS = TrackedGradientDefaults.HAND_DEFAULTS;
}

export namespace HandTrail1Const {
    export const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_DEFAULTS;
}

export namespace HandTrail2Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
    export const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_CYCLING_DEFAULTS;
}

export namespace HandTrail3Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
    export const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_CYCLING_DEFAULTS;
}

export namespace PixelTrailConst {
    export const STAMP_COUNT = 48;
    export const GRACE_MS = 100;
    export const CYCLING_DEFAULTS = TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS;
}

export namespace Spot1Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_DEFAULTS;
}

export namespace SpotFlare2Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_FLARE_DEFAULTS;
}

export namespace SpotFlare3Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_FLARE_DEFAULTS;
}

export namespace SpotRipple1Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_DEFAULTS;
}

export namespace SpotRipple2Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_CYCLING_DEFAULTS;
}

export namespace SpotRipple3Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_CYCLING_DEFAULTS;
}

export namespace SpotSmear1Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_SMEAR_DEFAULTS;
}

export namespace SpotSmear2Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_SMEAR_CYCLING_DEFAULTS;
}

export namespace SpotSmear3Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_SMEAR_CYCLING_DEFAULTS;
}

export namespace SpotTrail1Const {
    export const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_DEFAULTS;
}

export namespace SpotTrail2Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_CYCLING_DEFAULTS;
}

export namespace SpotTrail3Const {
    export const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
    export const DEFAULTS = TrackedGradientDefaults.SPOT_TRAIL_CYCLING_DEFAULTS;
}

export namespace SwarmConst {
    export const SETTLE_MS = 1500;
    export const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    export const STILL: Point2d = { x: 0, y: 0 };
    export const CYCLING_DEFAULTS = TrackedGradientDefaults.SWARM_CYCLING_DEFAULTS;
}
