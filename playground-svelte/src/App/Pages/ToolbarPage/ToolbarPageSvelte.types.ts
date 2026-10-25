import type { Snippet } from "svelte";

import type {
    BaseToolbarBasicDocsExampleCbs,
    BaseToolbarBasicDocsExampleValues,
    BaseToolbarTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.types";

export type ToolbarBasicDocsExampleProps = BaseToolbarBasicDocsExampleValues & BaseToolbarBasicDocsExampleCbs;

export type ToolbarTooltipDocsExampleProps = BaseToolbarTooltipDocsExampleValues;

export type ResizableBarProps = {
    width?: number;
    onResize?: (width: number) => void;
    children?: Snippet;
};
