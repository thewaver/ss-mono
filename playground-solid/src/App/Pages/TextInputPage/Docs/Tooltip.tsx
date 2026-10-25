import { createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TextInputTooltipDocsExampleProps } from "../TextInputPageSolid.types";

type Props = TextInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal("Hover or focus me");

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Field with a tooltip"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        A tooltip on a text field.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
