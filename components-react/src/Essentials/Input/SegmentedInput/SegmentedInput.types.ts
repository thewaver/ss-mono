import type { ReactNode } from "react";

import type { BaseSegmentedInputProps, SegmentedInputCellRenderProps } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";

export type SegmentedInputProps = Omit<
    TextFieldPresetProps,
    | "type"
    | "padding"
    | "gap"
    | "placeholderHint"
    | "min"
    | "max"
    | "step"
    | "computeMaskedText"
    | "computeTextStyle"
    | "renderContent"
    | "renderPlaceholder"
    | "renderLeading"
    | "renderTrailing"
> &
    BaseSegmentedInputProps & {
        /**
         * Draws one cell. It is handed the character in that cell, where it sits, whether the caret is in it and whether
         * it is selected, beside the field's own state — so the caret, the selection and the focus ring are all the
         * painter's to draw, since the field itself draws none of them. The cells are hidden from assistive technology,
         * which reads the field's value instead.
         */
        renderCell: (cell: SegmentedInputCellRenderProps) => ReactNode;
    };
