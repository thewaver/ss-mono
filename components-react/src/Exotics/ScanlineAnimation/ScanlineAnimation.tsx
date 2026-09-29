import { SCANLINE_ANIMATION_DEFAULTS } from "@thewaver/ss-components";

import { CellAnimation } from "../CellAnimation/CellAnimation";
import type { ScanlineAnimationProps } from "./ScanlineAnimation.types";

export const ScanlineAnimation = ({
    lineCount,
    orientation,
    computeScanlineAnimation,
    ...otherProps
}: ScanlineAnimationProps) => {
    const isVertical = (orientation ?? SCANLINE_ANIMATION_DEFAULTS.orientation) === "vertical";

    return (
        <CellAnimation
            {...otherProps}
            cellCount={isVertical ? { row: 1, col: lineCount } : { row: lineCount, col: 1 }}
            computeCellAnimation={computeScanlineAnimation}
        />
    );
};
