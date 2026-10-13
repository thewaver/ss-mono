import type { IcicleSpan } from "./Icicle.types";

export namespace IcicleConst {
    export const NOTHING = 0;
    export const SETTLED = 1;
    export const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };
    export const NEXT = 1;
}
