import type { AccessorProps, AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseToolbarBasicDocsExampleCbs,
    BaseToolbarBasicDocsExampleValues,
    BaseToolbarTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.types";

export type ToolbarBasicDocsExampleProps = AccessorValues<BaseToolbarBasicDocsExampleValues> &
    BaseToolbarBasicDocsExampleCbs;

export type ToolbarTooltipDocsExampleProps = AccessorValues<BaseToolbarTooltipDocsExampleValues>;

export type ResizableBarProps = AccessorProps<{
    width?: number;
    onResize?: (width: number) => void;
}>;
