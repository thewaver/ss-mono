import type { RollerFace } from "@thewaver/ss-components";
import type { Point3d } from "@thewaver/ss-utils";

import type { ValuePair } from "../../Utils/typeUtils.js";

export type RollerDefs = {
    getFaces: () => RollerFace[];
    getRadius: () => number;
    getRollDurationMs?: () => number | undefined;
    getSettleDurationMs?: () => number | undefined;
    getRestDurationMs?: () => number | undefined;
    getTumbleCount?: () => number | undefined;
    getMomentumMs?: () => number | undefined;
    getIdleDelayMs?: () => number | undefined;
    getDriftAxis?: () => Point3d | undefined;
    getIsMovable?: () => boolean | undefined;
    getIsAutoSpinEnabled?: () => boolean;
    targetFace?: ValuePair<number>;
    computeRollTarget?: () => number | Promise<number>;
    computeFaceLabel: (index: number, faceCount: number) => string;
    onRollEnd?: (index: number) => void;
};
