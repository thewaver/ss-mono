import type { Rect } from "@thewaver/ss-utils";

export type CutoutHole = Rect & {
    image?: string;
};

export type CutoutMaskStyle = {
    "mask-image": string;
    "-webkit-mask-image": string;
    "mask-position": string;
    "-webkit-mask-position": string;
    "mask-size": string;
    "-webkit-mask-size": string;
    "mask-repeat": string;
    "-webkit-mask-repeat": string;
    "mask-composite": string;
};
