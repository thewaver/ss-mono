import { createSignal } from "solid-js";

import { CurrencyInput } from "@thewaver/ss-components-solid";
import { STARTING_BIG } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { CurrencyInputLocaleDocsExampleProps } from "../CurrencyInputPageSolid.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputLocaleDocsExampleProps;

export const LocaleDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(STARTING_BIG);

    return (
        <CurrencyInput
            value={valueSignal}
            locale={props.locale}
            decimals={props.decimals}
            groupSizes={props.groupSizes}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Large amount"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
        />
    );
};
