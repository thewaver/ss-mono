import type { Rect, Size2d } from "@thewaver/ss-utils";

import type { SVGColorMixing } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.types";
import type { SliceStop } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";

export type SliceRendererMode = "slices" | "particles" | "direct";

export type SliceRendererTint = [red: number, green: number, blue: number, alpha: number];

export type SliceRendererDirect = [scaleX: number, scaleY: number, rotateDegrees: number, opacity: number];

export type SliceRendererSlice = {
    left: number;
    top: number;
    width: number;
    height: number;
    weight: number;
    table: number;
    tint?: SliceRendererTint;
    direct?: SliceRendererDirect;
};

export type SliceRendererFrame = {
    mode: SliceRendererMode;
    src: string;
    tables: SliceStop[][];
    easing: Float32Array;
    slices: SliceRendererSlice[];
    size: Size2d;
    area: Rect;
    scale: number;
    timeline: number;
    half: number;
    isDescending: boolean;
    isShown: boolean;
    hasPerspective: boolean;
    clockMs?: number;
    lifetimeMs?: number;
    channelMixing?: SVGColorMixing;
};

export type SliceRendererItem = {
    draw: (frame: SliceRendererFrame, onShown: (rect: Rect) => void) => void;
    dispose: () => void;
};

export type SliceRendererPictureStatus = "loading" | "shareable" | "unshareable" | "broken";

export type SliceRendererPicture = {
    status: SliceRendererPictureStatus;
    size: Size2d;
};
