import { splitProps } from "solid-js";

import { access } from "../../Utils/propUtils";
import { CellAnimation } from "../CellAnimation/CellAnimation";
import type { ScanlineAnimationProps } from "./ScanlineAnimation.types";

export const ScanlineAnimation = (props: ScanlineAnimationProps) => {
    const [local, otherProps] = splitProps(props, ["lineCount", "computeScanlineAnimation"]);

    return (
        <CellAnimation
            {...otherProps}
            cellCount={() => ({ row: access(local.lineCount), col: 1 })}
            computeCellAnimation={(defs, timeline) => local.computeScanlineAnimation(defs, timeline)}
        />
    );
};
