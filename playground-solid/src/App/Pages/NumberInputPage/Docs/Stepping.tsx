import { createSignal } from "solid-js";

import { NumberInput } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
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
import type { NumberInputSteppingDocsExampleProps } from "../NumberInputPageSolid.types";

type Props = NumberInputSteppingDocsExampleProps;

export const SteppingDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(13);

    return (
        <>
            <NumberInput
                value={valueSignal}
                min={props.min}
                max={props.max}
                step={props.step}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Quantity"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]() ?? "nothing"}`}
            </div>
        </>
    );
};
