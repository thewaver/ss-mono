import type { Circle } from "@thewaver/ss-utils";

export namespace CirclePackingConst {
    export const NOTHING = 0;
    export const HALF = 0.5;
    export const EMPTY_CIRCLE: Circle = { x: 0, y: 0, radius: 0 };
    export const NEXT = 1;
}
