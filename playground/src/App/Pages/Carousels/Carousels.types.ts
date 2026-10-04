import type { CarouselFace, CarouselOrientation } from "@thewaver/ss-components";

export type SlideFrame = "whole" | "narrow" | "paddle";

export type SlideFrameClasses = Record<CarouselFace, string>;

export type SlideFrameSet = Record<CarouselOrientation, SlideFrameClasses>;
