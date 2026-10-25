import { createSignal } from "solid-js";

import { CurrencyInput } from "@thewaver/ss-components-solid";
import { STARTING_PRICE } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

const FIELD_WIDTH = 200;

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<number | undefined>(STARTING_PRICE);

    return (
        <div dir={"rtl"}>
            <CurrencyInput
                value={valueSignal}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Price"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
                renderLeading={(getFlags) => <PageTextFieldAdornment flags={getFlags}>£</PageTextFieldAdornment>}
            />
        </div>
    );
};
