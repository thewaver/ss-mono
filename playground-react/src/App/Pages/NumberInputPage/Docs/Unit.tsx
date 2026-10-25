import { useState } from "react";

import { NumberInput } from "@thewaver/ss-components-react";
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
    const valueState = useState<number | undefined>(72);

    return (
        <NumberInput
            value={valueState}
            min={0}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Width"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderTrailing={(flags, stepper) => (
                <div className={styles.unitTrailing}>
                    <PageTextFieldAdornment flags={flags}>px</PageTextFieldAdornment>

                    <PageNumberInputStepper flags={flags} stepper={stepper} />
                </div>
            )}
        />
    );
};
