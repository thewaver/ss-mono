import type { AccessorProps, IcicleCellState } from "@thewaver/ss-components";

import type { PAGE_ICICLE_FAMILIES } from "./IcicleContent.css";

export type PageIcicleFamily = (typeof PAGE_ICICLE_FAMILIES)[number];

export type PageIcicleCellProps = AccessorProps<{
    state: IcicleCellState;
    family: PageIcicleFamily | undefined;
    name: string;
    weight: string;
    title: string;
}>;
