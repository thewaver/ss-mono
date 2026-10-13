import type { BaseScanlineAnimationCbs, BaseScanlineAnimationValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";
import type { CellAnimationProps } from "../CellAnimation/CellAnimationSolid.types";

export type ScanlineAnimationProps = Omit<CellAnimationProps, "cellCount" | "computeCellAnimation"> &
    AccessorValues<BaseScanlineAnimationValues> &
    BaseScanlineAnimationCbs;
