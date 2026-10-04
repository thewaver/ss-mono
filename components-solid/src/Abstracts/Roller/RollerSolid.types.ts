import type { RollerFace } from "@thewaver/ss-components";
import type { Point3d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type RollerDefs = AccessorProps<{
    faces: RollerFace[];
    radius: number;
    rollDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
    tumbleCount?: number;
    momentumMs?: number;
    driftAxis?: Point3d;
    isMovable?: boolean;
    computeRollTarget?: () => number | Promise<number>;
    computeFaceLabel: (index: number, faceCount: number) => string;
    targetFace?: SignalSource<number>;
    autoSpin?: SignalSource<boolean>;
    onRollEnd?: (index: number) => void;
}> & {
    idleDelayMs?: MaybeAccessor<number | undefined>;
};
