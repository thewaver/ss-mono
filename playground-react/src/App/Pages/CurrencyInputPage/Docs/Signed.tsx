import { useState } from "react";

import { CurrencyInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_ADJUSTMENT } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputSignedDocsExampleProps } from "../CurrencyInputPageReact.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputSignedDocsExampleProps;

export const SignedDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(STARTING_ADJUSTMENT);

    return (
        <>
            <CurrencyInput
                value={valueState}
                hasSign={props.hasSign}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Adjustment"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0] ?? "nothing"}`}
            </div>
        </>
    );
};
