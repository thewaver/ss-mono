import type { Point3d, Store } from "@thewaver/ss-utils";

export type RollerQuaternion = {
    w: number;
    x: number;
    y: number;
    z: number;
};

export type RollerFace = {
    normal: Point3d;
    down: Point3d;
};

export type RollerPhase = "still" | "idling" | "rolling" | "settling" | "dragging" | "coasting";

export type RollerDirection = "left" | "right" | "up" | "down";

export type RollerState = {
    orientation: RollerQuaternion;
    rollPhase: Exclude<RollerPhase, "idling">;
    isAwaitingTarget: boolean;
    isResting: boolean;
    restingFace: number | undefined;
};

export type RollerCoreDefs = {
    getIsDisabled: () => boolean;
    getFaces: () => RollerFace[];
    getRollDurationMs: () => number;
    getSettleDurationMs: () => number;
    getTumbleCount: () => number;
    getMomentumMs: () => number;
    getRadius: () => number;
    getIsMovable: () => boolean;
    targetFace: [get: () => number, set: (value: number) => void];
    computeRollTarget?: () => number | Promise<number>;
    computeFaceLabel: (index: number, faceCount: number) => string;
    onRollEnd?: (index: number) => void;
};

export type RollerController = Store<RollerState> & {
    roll: () => boolean;
    step: (direction: RollerDirection) => boolean;
    rest: (index: number) => void;
    turnToTarget: (index: number) => void;
    reshape: () => void;
    startRest: (restDurationMs: number) => () => void;
    drift: (idleDelayMs: number | undefined, stepAngle: number, axis: Point3d) => () => void;
    observe: (element: HTMLElement) => () => void;
    stop: () => void;
};
