import type { Point2d } from "@thewaver/ss-utils";

import type { WeightFn, WeightOpts } from "./CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "./CellAnimationWeights.utils";
import { _clusterNoise } from "./Samples/_clusterNoise";
import { _frameConvergent } from "./Samples/_frameConvergent";
import { _frameDefault } from "./Samples/_frameDefault";
import { _noiseDefault } from "./Samples/_noiseDefault";
import { _radialAlternate } from "./Samples/_radialAlternate";
import { _radialDefault } from "./Samples/_radialDefault";
import { _rippleDefault } from "./Samples/_rippleDefault";
import { _sequenceMorton } from "./Samples/_sequenceMorton";
import { _sequenceStride } from "./Samples/_sequenceStride";
import { _sweepCcw } from "./Samples/_sweepCcw";
import { _sweepCw } from "./Samples/_sweepCw";
import { checkeredConvergent } from "./Samples/checkeredConvergent";
import { checkeredDefault } from "./Samples/checkeredDefault";
import { circularAlternate } from "./Samples/circularAlternate";
import { circularConvergent } from "./Samples/circularConvergent";
import { circularDefault } from "./Samples/circularDefault";
import { entwineColumn } from "./Samples/entwineColumn";
import { entwineRow } from "./Samples/entwineRow";
import { lineColumn } from "./Samples/lineColumn";
import { lineColumnAlternate } from "./Samples/lineColumnAlternate";
import { lineColumnConvergent } from "./Samples/lineColumnConvergent";
import { lineRow } from "./Samples/lineRow";
import { lineRowAlternate } from "./Samples/lineRowAlternate";
import { lineRowConvergent } from "./Samples/lineRowConvergent";
import { ovalColumn } from "./Samples/ovalColumn";
import { ovalRow } from "./Samples/ovalRow";
import { quadrantDefault } from "./Samples/quadrantDefault";
import { quadraticAlternate } from "./Samples/quadraticAlternate";
import { quadraticConvergent } from "./Samples/quadraticConvergent";
import { quadraticDefault } from "./Samples/quadraticDefault";
import { radarDouble } from "./Samples/radarDouble";
import { radarQuad } from "./Samples/radarQuad";
import { radarSingle } from "./Samples/radarSingle";
import { randomDefault } from "./Samples/randomDefault";
import { rollColumn } from "./Samples/rollColumn";
import { rollColumnConvergent } from "./Samples/rollColumnConvergent";
import { rollRow } from "./Samples/rollRow";
import { rollRowConvergent } from "./Samples/rollRowConvergent";
import { sequenceConvergent } from "./Samples/sequenceConvergent";
import { sequenceEvenOdd } from "./Samples/sequenceEvenOdd";
import { sequenceInterleaved } from "./Samples/sequenceInterleaved";
import { sequenceLinear } from "./Samples/sequenceLinear";
import { sequenceReverseBinary } from "./Samples/sequenceReverseBinary";
import { spiralDouble } from "./Samples/spiralDouble";
import { spiralQuad } from "./Samples/spiralQuad";
import { spiralSingle } from "./Samples/spiralSingle";
import { zigzagColumn } from "./Samples/zigzagColumn";
import { zigzagRow } from "./Samples/zigzagRow";

export namespace CellAnimationWeights {
    export const WEIGHT_TYPES = [
        "checkeredConvergent",
        "checkeredDefault",
        "circularAlternate",
        "circularConvergent",
        "circularDefault",
        "entwineColumn",
        "entwineRow",
        "lineColumn",
        "lineColumnAlternate",
        "lineColumnConvergent",
        "lineRow",
        "lineRowAlternate",
        "lineRowConvergent",
        "ovalColumn",
        "ovalRow",
        "quadrantDefault",
        "quadraticAlternate",
        "quadraticConvergent",
        "quadraticDefault",
        "radarDouble",
        "radarQuad",
        "radarSingle",
        "randomDefault",
        "rollColumn",
        "rollColumnConvergent",
        "rollRow",
        "rollRowConvergent",
        "sequenceConvergent",
        "sequenceEvenOdd",
        "sequenceInterleaved",
        "sequenceLinear",
        "sequenceReverseBinary",
        "spiralDouble",
        "spiralQuad",
        "spiralSingle",
        "zigzagColumn",
        "zigzagRow",
        "_radialDefault",
        "_radialAlternate",
        "_sweepCw",
        "_sweepCcw",
        "_frameDefault",
        "_frameConvergent",
        "_rippleDefault",
        "_noiseDefault",
        "_clusterNoise",
        "_sequenceMorton",
        "_sequenceStride",
    ] as const;
    export type WeightType = (typeof WEIGHT_TYPES)[number];

    export const ORIGIN_FREE_WEIGHT_TYPES = [
        "sequenceConvergent",
        "sequenceEvenOdd",
        "sequenceInterleaved",
        "sequenceLinear",
        "sequenceReverseBinary",
        "randomDefault",
        "_frameDefault",
        "_frameConvergent",
        "_noiseDefault",
        "_clusterNoise",
        "_sequenceMorton",
        "_sequenceStride",
    ] as const satisfies readonly WeightType[];
    export type OriginFreeWeightType = (typeof ORIGIN_FREE_WEIGHT_TYPES)[number];

    export const isOriginAware = (type: WeightType) =>
        !(ORIGIN_FREE_WEIGHT_TYPES as readonly WeightType[]).includes(type);

    export const SAMPLE_WEIGHTS: Record<WeightType, WeightFn> = {
        lineRow,
        lineColumn,
        lineRowAlternate,
        lineColumnAlternate,
        lineRowConvergent,
        lineColumnConvergent,
        zigzagRow,
        zigzagColumn,
        rollRow,
        rollColumn,
        rollRowConvergent,
        rollColumnConvergent,
        entwineRow,
        entwineColumn,
        ovalRow,
        ovalColumn,
        circularDefault,
        circularAlternate,
        circularConvergent,
        quadraticDefault,
        quadraticAlternate,
        quadraticConvergent,
        spiralSingle,
        spiralDouble,
        spiralQuad,
        radarSingle,
        radarDouble,
        radarQuad,
        quadrantDefault,
        checkeredDefault,
        checkeredConvergent,
        sequenceLinear,
        sequenceConvergent,
        sequenceEvenOdd,
        sequenceInterleaved,
        sequenceReverseBinary,
        randomDefault,
        _radialDefault,
        _radialAlternate,
        _sweepCw,
        _sweepCcw,
        _frameDefault,
        _frameConvergent,
        _rippleDefault,
        _noiseDefault,
        _clusterNoise,
        _sequenceMorton,
        _sequenceStride,
    };

    export const computeCellWeights = (type: WeightType, count: Point2d, origin: Point2d, opts?: WeightOpts) =>
        CellAnimationWeightUtils.computeCellWeights(SAMPLE_WEIGHTS[type], count, origin, opts);
}
