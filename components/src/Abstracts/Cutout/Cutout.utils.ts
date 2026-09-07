import type { JSX } from "solid-js";

import type { CutoutHole } from "./Cutout.types";

const FULL_COVERAGE_LAYER = "linear-gradient(black, black)";
const KEEP_OUTSIDE_HOLES = "subtract";
const JOIN_WITH_OTHER_HOLES = "add";

export namespace CutoutUtils {
    export const getMaskStyle = (holes: CutoutHole[]): JSX.CSSProperties => {
        const images = [FULL_COVERAGE_LAYER, ...holes.map((hole) => hole.image ?? FULL_COVERAGE_LAYER)].join(", ");
        const positions = ["0 0", ...holes.map((hole) => `${hole.x}px ${hole.y}px`)].join(", ");
        const sizes = ["auto", ...holes.map((hole) => `${hole.width}px ${hole.height}px`)].join(", ");
        const composites = [KEEP_OUTSIDE_HOLES, ...holes.map(() => JOIN_WITH_OTHER_HOLES)].join(", ");

        return {
            "mask-image": images,
            "-webkit-mask-image": images,
            "mask-position": positions,
            "-webkit-mask-position": positions,
            "mask-size": sizes,
            "-webkit-mask-size": sizes,
            "mask-repeat": "no-repeat",
            "-webkit-mask-repeat": "no-repeat",
            "mask-composite": composites,
        };
    };
}
