import { createSignal } from "solid-js";

import { TextArea } from "@thewaver/ss-components-solid";
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
import type { TextAreaTooltipDocsExampleProps } from "../TextAreaPageSolid.types";

type Props = TextAreaTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal("Hover or focus me");

    return (
        <TextArea
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Notes with a tooltip"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => (
                <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
            )}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        A tooltip on a text area.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
