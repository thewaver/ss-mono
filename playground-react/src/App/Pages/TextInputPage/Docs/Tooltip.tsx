import { useState } from "react";

import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TextInputTooltipDocsExampleProps } from "../TextInputPageReact.types";

type Props = TextInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState("Hover or focus me");

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Field with a tooltip"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a text field.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
