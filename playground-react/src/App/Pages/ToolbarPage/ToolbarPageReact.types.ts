import type { BaseToolbarExampleProps } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.types";

export type ToolbarExampleProps = BaseToolbarExampleProps;

export type ToolbarPressedExampleProps = ToolbarExampleProps & {
    pressedValues: readonly [string[], (values: string[]) => void];
};
