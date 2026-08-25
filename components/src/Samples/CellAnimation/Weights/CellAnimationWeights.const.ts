import type { Point2d } from "@thewaver/ss-utils";

import type { WeightFn, WeightOpts } from "./CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "./CellAnimationWeights.utils";
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
import { rippleDiamondTravelling } from "./Samples/rippleDiamondTravelling";
import { rippleDiamondWide } from "./Samples/rippleDiamondWide";
import { rippleTight } from "./Samples/rippleTight";
import { rippleTravelling } from "./Samples/rippleTravelling";
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
        "checkeredConvergent",
        "checkeredDefault",
        "diamondAlternate",
        "diamondConvergent",
        "diamondDefault",
        "entwineColumn",
        "entwineDiagonalDown",
        "entwineDiagonalUp",
        "entwineRow",
        "frameFarthestAlternate",
        "frameFarthestConvergent",
        "frameFarthestDefault",
        "frameNearestAlternate",
        "frameNearestConvergent",
        "frameNearestDefault",
        "frameStretchedAlternate",
        "frameStretchedConvergent",
        "frameStretchedDefault",
        "lineColumn",
        "lineColumnAlternate",
        "lineColumnConvergent",
        "lineDiagonalDown",
        "lineDiagonalDownAlternate",
        "lineDiagonalDownConvergent",
        "lineDiagonalUp",
        "lineDiagonalUpAlternate",
        "lineDiagonalUpConvergent",
        "lineRow",
        "lineRowAlternate",
        "lineRowConvergent",
        "ovalColumn",
        "ovalRow",
        "quadrantDown",
        "quadrantUp",
        "radarDouble",
        "radarDoubleCw",
        "radarQuad",
        "radarQuadCw",
        "radarSingle",
        "radarSingleCw",
        "radialAlternate",
        "radialConvergent",
        "radialDefault",
        "randomClustered",
        "randomDefault",
        "rippleDefault",
        "rippleDiamondDefault",
        "rippleDiamondTight",
        "rippleDiamondTravelling",
        "rippleDiamondWide",
        "rippleTight",
        "rippleTravelling",
        "rippleWide",
        "rollColumn",
        "rollColumnConvergent",
        "rollDiagonalDown",
        "rollDiagonalDownConvergent",
        "rollDiagonalUp",
        "rollDiagonalUpConvergent",
        "rollRow",
        "rollRowConvergent",
        "sequenceConvergent",
        "sequenceEvenOdd",
        "sequenceInterleaved",
        "sequenceLinear",
        "sequenceMorton",
        "sequenceReverseBinary",
        "sequenceStrideColumn",
        "sequenceStrideRow",
        "spiralDouble",
        "spiralQuad",
        "spiralSingle",
        "zigzagColumn",
        "zigzagRow",
    ] as const;
    export type WeightType = (typeof WEIGHT_TYPES)[number];

    export const ORIGIN_FREE_WEIGHT_TYPES = [
        "randomClustered",
        "randomDefault",
        "sequenceConvergent",
        "sequenceEvenOdd",
        "sequenceInterleaved",
        "sequenceLinear",
        "sequenceReverseBinary",
    ] as const satisfies readonly WeightType[];
    export type OriginFreeWeightType = (typeof ORIGIN_FREE_WEIGHT_TYPES)[number];

    export const isOriginAware = (type: WeightType) =>
        !(ORIGIN_FREE_WEIGHT_TYPES as readonly WeightType[]).includes(type);

    export const SAMPLE_WEIGHTS: Record<WeightType, WeightFn> = {
        checkeredConvergent,
        checkeredDefault,
        diamondAlternate,
        diamondConvergent,
        diamondDefault,
        entwineColumn,
        entwineDiagonalDown,
        entwineDiagonalUp,
        entwineRow,
        frameFarthestAlternate,
        frameFarthestConvergent,
        frameFarthestDefault,
        frameNearestAlternate,
        frameNearestConvergent,
        frameNearestDefault,
        frameStretchedAlternate,
        frameStretchedConvergent,
        frameStretchedDefault,
        lineColumn,
        lineColumnAlternate,
        lineColumnConvergent,
        lineDiagonalDown,
        lineDiagonalDownAlternate,
        lineDiagonalDownConvergent,
        lineDiagonalUp,
        lineDiagonalUpAlternate,
        lineDiagonalUpConvergent,
        lineRow,
        lineRowAlternate,
        lineRowConvergent,
        ovalColumn,
        ovalRow,
        quadrantDown,
        quadrantUp,
        radarDouble,
        radarDoubleCw,
        radarQuad,
        radarQuadCw,
        radarSingle,
        radarSingleCw,
        radialAlternate,
        radialConvergent,
        radialDefault,
        randomClustered,
        randomDefault,
        rippleDefault,
        rippleDiamondDefault,
        rippleDiamondTight,
        rippleDiamondTravelling,
        rippleDiamondWide,
        rippleTight,
        rippleTravelling,
        rippleWide,
        rollColumn,
        rollColumnConvergent,
        rollDiagonalDown,
        rollDiagonalDownConvergent,
        rollDiagonalUp,
        rollDiagonalUpConvergent,
        rollRow,
        rollRowConvergent,
        sequenceConvergent,
        sequenceEvenOdd,
        sequenceInterleaved,
        sequenceLinear,
        sequenceMorton,
        sequenceReverseBinary,
        sequenceStrideColumn,
        sequenceStrideRow,
        spiralDouble,
        spiralQuad,
        spiralSingle,
        zigzagColumn,
        zigzagRow,
    };

    export const computeCellWeights = (type: WeightType, count: Point2d, origin: Point2d, opts?: WeightOpts) =>
        CellAnimationWeightUtils.computeCellWeights(SAMPLE_WEIGHTS[type], count, origin, opts);
}
