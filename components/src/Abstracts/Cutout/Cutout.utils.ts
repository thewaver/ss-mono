import type { JSX } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

const FULL_COVERAGE_LAYER = "linear-gradient(black, black)";

export namespace CutoutUtils {
    export const getMaskStyle = (hole: Rect, holeImage: string = FULL_COVERAGE_LAYER): JSX.CSSProperties => {
        const layers = `${FULL_COVERAGE_LAYER}, ${holeImage}`;
        const positions = `0 0, ${hole.x}px ${hole.y}px`;
        const sizes = `auto, ${hole.width}px ${hole.height}px`;

        return {
            "mask-image": layers,
            "-webkit-mask-image": layers,
            "mask-position": positions,
            "-webkit-mask-position": positions,
            "mask-size": sizes,
            "-webkit-mask-size": sizes,
            "mask-repeat": "no-repeat",
            "-webkit-mask-repeat": "no-repeat",
            "mask-composite": "exclude",
            "-webkit-mask-composite": "xor",
        };
    };
}
