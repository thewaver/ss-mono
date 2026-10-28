import type { SVGColorMixing } from "@thewaver/ss-components";

export type BaseRGBAnimationExampleValues = {
    src: string;
    ariaLabel: string;
    colorMixing: SVGColorMixing | undefined;
    animationDurationMs: number;
    animationIterationDelayMs: number;
};

export type BaseRGBAnimationExampleProps = BaseRGBAnimationExampleValues;

export type RGBAnimationSourceKey = "knight" | "text";
