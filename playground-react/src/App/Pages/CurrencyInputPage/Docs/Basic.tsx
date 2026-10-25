import { useState } from "react";

import { CurrencyInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_PRICE } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputBasicDocsExampleProps } from "../CurrencyInputPageReact.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(STARTING_PRICE);

    return (
        <>
            <CurrencyInput
                value={valueState}
                isReadOnly={props.isReadOnly}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Price"}
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
