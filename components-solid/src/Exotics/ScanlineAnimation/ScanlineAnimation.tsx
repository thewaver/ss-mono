import { createMemo, splitProps } from "solid-js";

import { SCANLINE_ANIMATION_DEFAULTS } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import { CellAnimation } from "../CellAnimation/CellAnimation";
import type { ScanlineAnimationProps } from "./ScanlineAnimationSolid.types";

export const ScanlineAnimation = (props: ScanlineAnimationProps) => {
    const [local, otherProps] = splitProps(props, ["lineCount", "orientation", "computeScanlineAnimation"]);

    const getOrientation = createMemo(() => access(local.orientation) ?? SCANLINE_ANIMATION_DEFAULTS.orientation);

    return (
        <CellAnimation
            {...otherProps}
            cellCount={() =>
                getOrientation() === "vertical"
                    ? { row: 1, col: access(local.lineCount) }
                    : { row: access(local.lineCount), col: 1 }
            }
            computeCellAnimation={(defs, timeline) => local.computeScanlineAnimation(defs, timeline)}
        />
    );
};
