import { createSignal } from "solid-js";

import { NumberInput } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { NumberInputTooltipDocsExampleProps } from "../NumberInputPageSolid.types";

type Props = NumberInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(7);

    return (
        <NumberInput
            value={valueSignal}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Disabled but reachable amount"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the
                        value.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
