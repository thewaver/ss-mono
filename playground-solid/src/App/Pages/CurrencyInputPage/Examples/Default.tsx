import { CurrencyInput, access } from "@thewaver/ss-components-solid";
import type { MaybeAccessor } from "@thewaver/ss-components-solid";
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

type Props = CurrencyInputExampleProps & { ariaLabel?: MaybeAccessor<string> };

export const DefaultExample = (props: Props) => {
    return (
        <CurrencyInput
            value={props.value}
            ariaLabel={() => access(props.ariaLabel) ?? "Price"}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            locale={props.locale}
            decimals={props.decimals}
            groupSizes={props.groupSizes}
            hasSign={props.hasSign}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
        />
    );
};
