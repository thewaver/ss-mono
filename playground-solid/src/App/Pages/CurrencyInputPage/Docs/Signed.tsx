import { createSignal } from "solid-js";

import { CurrencyInput } from "@thewaver/ss-components-solid";
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
import type { CurrencyInputSignedDocsExampleProps } from "../CurrencyInputPageSolid.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputSignedDocsExampleProps;

export const SignedDocsExample = (props: Props) => {
    const valueSignal = createSignal<number | undefined>(STARTING_ADJUSTMENT);

    return (
        <CurrencyInput
            value={valueSignal}
            hasSign={props.hasSign}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Adjustment"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
        />
    );
};
