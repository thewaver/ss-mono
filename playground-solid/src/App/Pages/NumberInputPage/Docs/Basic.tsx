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
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { NumberInputBasicDocsExampleProps } from "../NumberInputPageSolid.types";

type Props = NumberInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(undefined);

    return (
        <NumberInput
            value={valueSignal}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isReadOnly={props.isReadOnly}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"How many"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderPlaceholder={(getFlags) => (
                <PageTextFieldPlaceholder flags={getFlags}>How many</PageTextFieldPlaceholder>
            )}
            renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
        />
    );
};
