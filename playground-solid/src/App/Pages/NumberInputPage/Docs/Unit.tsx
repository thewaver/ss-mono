import { createSignal } from "solid-js";

import { NumberInput } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.css";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const UnitDocsExample = () => {
    const valueSignal = createSignal<number | undefined>(72);

    return (
        <NumberInput
            value={valueSignal}
            min={0}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Width"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderTrailing={(getFlags, stepper) => (
                <div class={styles.unitTrailing}>
                    <PageTextFieldAdornment flags={getFlags}>px</PageTextFieldAdornment>

                    <PageNumberInputStepper flags={getFlags} stepper={stepper} />
                </div>
            )}
        />
    );
};
