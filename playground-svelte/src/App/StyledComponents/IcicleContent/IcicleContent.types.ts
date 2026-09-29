import type { IcicleCellState } from "@thewaver/ss-components-svelte";
import type { PAGE_ICICLE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

export type PageIcicleFamily = (typeof PAGE_ICICLE_FAMILIES)[number];

export type PageIcicleCellProps = {
    state: IcicleCellState;
    family: PageIcicleFamily | undefined;
    name: string;
    weight: string;
    title: string;
};
