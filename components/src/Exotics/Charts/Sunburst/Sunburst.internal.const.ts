import type { SunburstSpan } from "./Sunburst.types";

export namespace SunburstConst {
    export const NOTHING = 0;
    export const SETTLED = 1;
    export const HALF = 0.5;
    export const CENTER_RINGS = 1;
    export const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };
    export const NEXT = 1;
}
