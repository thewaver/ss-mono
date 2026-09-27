import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const ReachableExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        isDisabled={true}
        isReachableWhenDisabled={true}
        ariaLabel={"Disabled but reachable field"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but typing must leave the value alone.
                </PageTooltipContent>
            ),
        }}
    />
);
