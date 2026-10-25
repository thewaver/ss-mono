import { useState } from "react";

import { NumberInput } from "@thewaver/ss-components-react";
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
import type { NumberInputSteppingDocsExampleProps } from "../NumberInputPageReact.types";

type Props = NumberInputSteppingDocsExampleProps;

export const SteppingDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(13);

    return (
        <>
            <NumberInput
                value={valueState}
                min={props.min}
                max={props.max}
                step={props.step}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Quantity"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0] ?? "nothing"}`}
            </div>
        </>
    );
};
