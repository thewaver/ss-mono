import { CurrencyInput } from "@thewaver/ss-components-react";
import { BUDGET_MAX } from "@thewaver/ss-playground-core/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputExampleProps } from "../CurrencyInputPage.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputExampleProps;

export const BoundedExample = (props: Props) => {
    return (
        <CurrencyInput
            valueState={props.valueState}
            max={BUDGET_MAX}
            ariaLabel={"Budget"}
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
        />
    );
};
