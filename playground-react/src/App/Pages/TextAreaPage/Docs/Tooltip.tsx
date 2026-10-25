import { useState } from "react";

import { TextArea } from "@thewaver/ss-components-react";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TextAreaTooltipDocsExampleProps } from "../TextAreaPageReact.types";

type Props = TextAreaTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState("Hover or focus me");

    return (
        <TextArea
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Notes with a tooltip"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A tooltip on a text area.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
