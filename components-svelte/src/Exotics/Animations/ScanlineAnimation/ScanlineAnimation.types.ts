import type { BaseScanlineAnimationProps } from "@thewaver/ss-components";

import type { CellAnimationProps } from "../CellAnimation/CellAnimation.types.js";

export type ScanlineAnimationProps = Omit<CellAnimationProps, "cellCount" | "computeSliceAnimation"> &
    BaseScanlineAnimationProps;
