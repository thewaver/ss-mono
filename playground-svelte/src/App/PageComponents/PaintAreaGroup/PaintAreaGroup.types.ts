import type { Snippet } from "svelte";

import type { Size2d } from "@thewaver/ss-utils";

export type PagePaintAreaGroupCell = {
    index: number;
    groupElement: HTMLElement | undefined;
    groupSize: Size2d;
};

export type PagePaintAreaGroupProps = {
    groupClass: string;
    cellCount: number;
    cell: Snippet<[PagePaintAreaGroupCell]>;
};
