import { TableUtils } from "./Table.utils";

export namespace TableConst {
    export const HEADER_ROW_INDEX = TableUtils.HEADER_ROW_INDEX;
    export const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;
    export const NO_RESIZING = "";
    export const EMPTY_PINNED_ROWS: number[] = [];
    export const EMPTY_WIDTHS: Record<string, number> = {};
    export const EMPTY_ORDER: string[] = [];
    export const EMPTY_SELECTION: never[] = [];
}
