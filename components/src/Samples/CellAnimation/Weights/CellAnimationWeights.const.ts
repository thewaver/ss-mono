import type { Index2d } from "@thewaver/ss-utils";

import type { WeightFn, WeightOpts } from "../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";
import { checkeredConvergent } from "./Samples/checkeredConvergent";
import { checkeredDefault } from "./Samples/checkeredDefault";
import { diamondAlternate } from "./Samples/diamondAlternate";
import { diamondConvergent } from "./Samples/diamondConvergent";
import { diamondDefault } from "./Samples/diamondDefault";
import { entwineColumn } from "./Samples/entwineColumn";
import { entwineDiagonalDown } from "./Samples/entwineDiagonalDown";
import { entwineDiagonalUp } from "./Samples/entwineDiagonalUp";
import { entwineRow } from "./Samples/entwineRow";
import { frameFarthestAlternate } from "./Samples/frameFarthestAlternate";
import { frameFarthestConvergent } from "./Samples/frameFarthestConvergent";
import { frameFarthestDefault } from "./Samples/frameFarthestDefault";
import { frameNearestAlternate } from "./Samples/frameNearestAlternate";
import { frameNearestConvergent } from "./Samples/frameNearestConvergent";
import { frameNearestDefault } from "./Samples/frameNearestDefault";
import { frameStretchedAlternate } from "./Samples/frameStretchedAlternate";
import { frameStretchedConvergent } from "./Samples/frameStretchedConvergent";
import { frameStretchedDefault } from "./Samples/frameStretchedDefault";
import { lineColumn } from "./Samples/lineColumn";
import { lineColumnAlternate } from "./Samples/lineColumnAlternate";
import { lineColumnConvergent } from "./Samples/lineColumnConvergent";
import { lineDiagonalDown } from "./Samples/lineDiagonalDown";
import { lineDiagonalDownAlternate } from "./Samples/lineDiagonalDownAlternate";
import { lineDiagonalDownConvergent } from "./Samples/lineDiagonalDownConvergent";
import { lineDiagonalUp } from "./Samples/lineDiagonalUp";
import { lineDiagonalUpAlternate } from "./Samples/lineDiagonalUpAlternate";
import { lineDiagonalUpConvergent } from "./Samples/lineDiagonalUpConvergent";
import { lineRow } from "./Samples/lineRow";
import { lineRowAlternate } from "./Samples/lineRowAlternate";
import { lineRowConvergent } from "./Samples/lineRowConvergent";
import { ovalColumn } from "./Samples/ovalColumn";
import { ovalRow } from "./Samples/ovalRow";
import { quadrantDown } from "./Samples/quadrantDown";
import { quadrantUp } from "./Samples/quadrantUp";
import { radarDouble } from "./Samples/radarDouble";
import { radarDoubleCw } from "./Samples/radarDoubleCw";
import { radarQuad } from "./Samples/radarQuad";
import { radarQuadCw } from "./Samples/radarQuadCw";
import { radarSingle } from "./Samples/radarSingle";
import { radarSingleCw } from "./Samples/radarSingleCw";
import { radialAlternate } from "./Samples/radialAlternate";
import { radialConvergent } from "./Samples/radialConvergent";
import { radialDefault } from "./Samples/radialDefault";
import { randomClustered } from "./Samples/randomClustered";
import { randomDefault } from "./Samples/randomDefault";
import { rippleDefault } from "./Samples/rippleDefault";
import { rippleDiamondDefault } from "./Samples/rippleDiamondDefault";
import { rippleDiamondTight } from "./Samples/rippleDiamondTight";
import { rippleDiamondTraveling } from "./Samples/rippleDiamondTraveling";
import { rippleDiamondWide } from "./Samples/rippleDiamondWide";
import { rippleTight } from "./Samples/rippleTight";
import { rippleTraveling } from "./Samples/rippleTraveling";
import { rippleWide } from "./Samples/rippleWide";
import { rollColumn } from "./Samples/rollColumn";
import { rollColumnConvergent } from "./Samples/rollColumnConvergent";
import { rollDiagonalDown } from "./Samples/rollDiagonalDown";
import { rollDiagonalDownConvergent } from "./Samples/rollDiagonalDownConvergent";
import { rollDiagonalUp } from "./Samples/rollDiagonalUp";
import { rollDiagonalUpConvergent } from "./Samples/rollDiagonalUpConvergent";
import { rollRow } from "./Samples/rollRow";
import { rollRowConvergent } from "./Samples/rollRowConvergent";
import { sequenceConvergent } from "./Samples/sequenceConvergent";
import { sequenceEvenOdd } from "./Samples/sequenceEvenOdd";
import { sequenceInterleaved } from "./Samples/sequenceInterleaved";
import { sequenceLinear } from "./Samples/sequenceLinear";
import { sequenceMorton } from "./Samples/sequenceMorton";
import { sequenceReverseBinary } from "./Samples/sequenceReverseBinary";
import { sequenceStrideColumn } from "./Samples/sequenceStrideColumn";
import { sequenceStrideRow } from "./Samples/sequenceStrideRow";
import { spiralDouble } from "./Samples/spiralDouble";
import { spiralQuad } from "./Samples/spiralQuad";
import { spiralSingle } from "./Samples/spiralSingle";
import { zigzagColumn } from "./Samples/zigzagColumn";
import { zigzagRow } from "./Samples/zigzagRow";

export namespace CellAnimationWeights {
    export const WEIGHT_TYPES = [
        "checkered_convergent",
        "checkered_default",
        "diamond_alternate",
        "diamond_convergent",
        "diamond_default",
        "entwine_column",
        "entwine_diagonal_down",
        "entwine_diagonal_up",
        "entwine_row",
        "frame_farthest_alternate",
        "frame_farthest_convergent",
        "frame_farthest_default",
        "frame_nearest_alternate",
        "frame_nearest_convergent",
        "frame_nearest_default",
        "frame_stretched_alternate",
        "frame_stretched_convergent",
        "frame_stretched_default",
        "line_column",
        "line_column_alternate",
        "line_column_convergent",
        "line_diagonal_down",
        "line_diagonal_down_alternate",
        "line_diagonal_down_convergent",
        "line_diagonal_up",
        "line_diagonal_up_alternate",
        "line_diagonal_up_convergent",
        "line_row",
        "line_row_alternate",
        "line_row_convergent",
        "oval_column",
        "oval_row",
        "quadrant_down",
        "quadrant_up",
        "radar_double",
        "radar_double_cw",
        "radar_quad",
        "radar_quad_cw",
        "radar_single",
        "radar_single_cw",
        "radial_alternate",
        "radial_convergent",
        "radial_default",
        "random_clustered",
        "random_default",
        "ripple_default",
        "ripple_diamond_default",
        "ripple_diamond_tight",
        "ripple_diamond_traveling",
        "ripple_diamond_wide",
        "ripple_tight",
        "ripple_traveling",
        "ripple_wide",
        "roll_column",
        "roll_column_convergent",
        "roll_diagonal_down",
        "roll_diagonal_down_convergent",
        "roll_diagonal_up",
        "roll_diagonal_up_convergent",
        "roll_row",
        "roll_row_convergent",
        "sequence_convergent",
        "sequence_even_odd",
        "sequence_interleaved",
        "sequence_linear",
        "sequence_morton",
        "sequence_reverse_binary",
        "sequence_stride_column",
        "sequence_stride_row",
        "spiral_double",
        "spiral_quad",
        "spiral_single",
        "zigzag_column",
        "zigzag_row",
    ] as const;
    export type WeightType = (typeof WEIGHT_TYPES)[number];

    export const ORIGIN_FREE_WEIGHT_TYPES = [
        "random_clustered",
        "random_default",
        "sequence_convergent",
        "sequence_even_odd",
        "sequence_interleaved",
        "sequence_linear",
        "sequence_reverse_binary",
    ] as const satisfies readonly WeightType[];
    export type OriginFreeWeightType = (typeof ORIGIN_FREE_WEIGHT_TYPES)[number];

    export const isOriginAware = (type: WeightType) =>
        !(ORIGIN_FREE_WEIGHT_TYPES as readonly WeightType[]).includes(type);

    export const SAMPLE_WEIGHTS: Record<WeightType, WeightFn> = {
        checkered_convergent: checkeredConvergent,
        checkered_default: checkeredDefault,
        diamond_alternate: diamondAlternate,
        diamond_convergent: diamondConvergent,
        diamond_default: diamondDefault,
        entwine_column: entwineColumn,
        entwine_diagonal_down: entwineDiagonalDown,
        entwine_diagonal_up: entwineDiagonalUp,
        entwine_row: entwineRow,
        frame_farthest_alternate: frameFarthestAlternate,
        frame_farthest_convergent: frameFarthestConvergent,
        frame_farthest_default: frameFarthestDefault,
        frame_nearest_alternate: frameNearestAlternate,
        frame_nearest_convergent: frameNearestConvergent,
        frame_nearest_default: frameNearestDefault,
        frame_stretched_alternate: frameStretchedAlternate,
        frame_stretched_convergent: frameStretchedConvergent,
        frame_stretched_default: frameStretchedDefault,
        line_column: lineColumn,
        line_column_alternate: lineColumnAlternate,
        line_column_convergent: lineColumnConvergent,
        line_diagonal_down: lineDiagonalDown,
        line_diagonal_down_alternate: lineDiagonalDownAlternate,
        line_diagonal_down_convergent: lineDiagonalDownConvergent,
        line_diagonal_up: lineDiagonalUp,
        line_diagonal_up_alternate: lineDiagonalUpAlternate,
        line_diagonal_up_convergent: lineDiagonalUpConvergent,
        line_row: lineRow,
        line_row_alternate: lineRowAlternate,
        line_row_convergent: lineRowConvergent,
        oval_column: ovalColumn,
        oval_row: ovalRow,
        quadrant_down: quadrantDown,
        quadrant_up: quadrantUp,
        radar_double: radarDouble,
        radar_double_cw: radarDoubleCw,
        radar_quad: radarQuad,
        radar_quad_cw: radarQuadCw,
        radar_single: radarSingle,
        radar_single_cw: radarSingleCw,
        radial_alternate: radialAlternate,
        radial_convergent: radialConvergent,
        radial_default: radialDefault,
        random_clustered: randomClustered,
        random_default: randomDefault,
        ripple_default: rippleDefault,
        ripple_diamond_default: rippleDiamondDefault,
        ripple_diamond_tight: rippleDiamondTight,
        ripple_diamond_traveling: rippleDiamondTraveling,
        ripple_diamond_wide: rippleDiamondWide,
        ripple_tight: rippleTight,
        ripple_traveling: rippleTraveling,
        ripple_wide: rippleWide,
        roll_column: rollColumn,
        roll_column_convergent: rollColumnConvergent,
        roll_diagonal_down: rollDiagonalDown,
        roll_diagonal_down_convergent: rollDiagonalDownConvergent,
        roll_diagonal_up: rollDiagonalUp,
        roll_diagonal_up_convergent: rollDiagonalUpConvergent,
        roll_row: rollRow,
        roll_row_convergent: rollRowConvergent,
        sequence_convergent: sequenceConvergent,
        sequence_even_odd: sequenceEvenOdd,
        sequence_interleaved: sequenceInterleaved,
        sequence_linear: sequenceLinear,
        sequence_morton: sequenceMorton,
        sequence_reverse_binary: sequenceReverseBinary,
        sequence_stride_column: sequenceStrideColumn,
        sequence_stride_row: sequenceStrideRow,
        spiral_double: spiralDouble,
        spiral_quad: spiralQuad,
        spiral_single: spiralSingle,
        zigzag_column: zigzagColumn,
        zigzag_row: zigzagRow,
    };

    export const computeCellWeights = (type: WeightType, count: Index2d, origin: Index2d, opts?: WeightOpts) =>
        CellAnimationWeightUtils.computeCellWeights(SAMPLE_WEIGHTS[type], count, origin, opts);
}
