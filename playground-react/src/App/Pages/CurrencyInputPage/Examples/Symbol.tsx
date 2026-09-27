import { CurrencyInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputExampleProps } from "../CurrencyInputPage.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputExampleProps;

export const SymbolExample = (props: Props) => {
    return (
        <CurrencyInput
            valueState={props.valueState}
            ariaLabel={"Price with a symbol"}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            locale={props.locale}
            decimals={props.decimals}
            groupSizes={props.groupSizes}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderLeading={(flags) => <PageTextFieldAdornment flags={flags}>£</PageTextFieldAdornment>}
        />
    );
};
