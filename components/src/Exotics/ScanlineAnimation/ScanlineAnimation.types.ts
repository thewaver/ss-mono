import type { AccessorProps } from "../../Utils/typeUtils";
import type {
    CellAnimationEvaluationDefs,
    CellAnimationEvaluationResult,
    CellAnimationProps,
} from "../CellAnimation/CellAnimation.types";

export type ScanlineAnimationEvaluationDefs = CellAnimationEvaluationDefs;

export type ScanlineAnimationEvaluationResult = CellAnimationEvaluationResult;

export type ScanlineAnimationProps = Omit<CellAnimationProps, "cellCount" | "computeCellAnimation"> &
    AccessorProps<{
        /** How many lines the picture is cut into. More lines is a finer sweep and more work per frame. */
        lineCount: number;
        /** What one line does on its turn, given where it is and how far through the pass it is. */
        computeScanlineAnimation: (
            defs: ScanlineAnimationEvaluationDefs,
            timeline: number,
        ) => ScanlineAnimationEvaluationResult;
    }>;
