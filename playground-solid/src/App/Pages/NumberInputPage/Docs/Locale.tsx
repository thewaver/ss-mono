import { createSignal } from "solid-js";

import { NumberInput } from "@thewaver/ss-components-solid";
import { AMOUNT_STEP, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { NumberInputLocaleDocsExampleProps } from "../NumberInputPageSolid.types";

type Props = NumberInputLocaleDocsExampleProps;

export const LocaleDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(1234.5);

    return (
        <NumberInput
            value={valueSignal}
            locale={props.locale}
            step={AMOUNT_STEP}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Amount"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
        />
    );
};
