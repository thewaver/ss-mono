import type { BaseScanlineAnimationProps } from "@thewaver/ss-components";

import type { CellAnimationProps } from "../CellAnimation/CellAnimation.types";

export type ScanlineAnimationProps = Omit<CellAnimationProps, "cellCount" | "computeSliceAnimation"> &
    BaseScanlineAnimationProps;
