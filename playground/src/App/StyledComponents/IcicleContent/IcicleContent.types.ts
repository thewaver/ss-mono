import type { IcicleCellState } from "@thewaver/ss-components";

import type { PAGE_ICICLE_FAMILIES } from "./IcicleContent.css";

export type PageIcicleFamily = (typeof PAGE_ICICLE_FAMILIES)[number];

export type BasePageIcicleCellValues = {
    state: IcicleCellState;
    family: PageIcicleFamily | undefined;
    name: string;
    weight: string;
    title: string;
};

export type BasePageIcicleCellProps = BasePageIcicleCellValues;
