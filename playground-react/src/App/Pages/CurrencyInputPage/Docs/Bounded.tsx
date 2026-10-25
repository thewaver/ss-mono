import { useState } from "react";

import { CurrencyInput } from "@thewaver/ss-components-react";
import { STARTING_BUDGET } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputBoundedDocsExampleProps } from "../CurrencyInputPageReact.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputBoundedDocsExampleProps;

export const BoundedDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(STARTING_BUDGET);

    return (
        <CurrencyInput
            value={valueState}
            max={props.max}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Budget"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
        />
    );
};
