import { CurrencyInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputExampleProps } from "../CurrencyInputPage.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputExampleProps & { ariaLabel?: string };

export const DefaultExample = (props: Props) => {
    return (
        <CurrencyInput
            valueState={props.valueState}
            ariaLabel={props.ariaLabel ?? "Price"}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            locale={props.locale}
            decimals={props.decimals}
            groupSizes={props.groupSizes}
            hasSign={props.hasSign}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
        />
    );
};
