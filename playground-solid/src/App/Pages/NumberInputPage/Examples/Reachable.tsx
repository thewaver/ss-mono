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
import type { NumberInputExampleProps } from "../NumberInputPage.types";

type Props = NumberInputExampleProps;

export const ReachableExample = (props: Props) => (
    <NumberInput
        value={props.value}
        isDisabled={true}
        isReachableWhenDisabled={true}
        padding={() => FIELD_STEPPER_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Disabled but reachable amount"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
        renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
        tooltipDefs={() => ({
            placement: () => ({ x: "center", y: "top-out" }),
            offset: () => ({ x: 0, y: 10 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the value.
                </PageTooltipContent>
            ),
        })}
    />
);
