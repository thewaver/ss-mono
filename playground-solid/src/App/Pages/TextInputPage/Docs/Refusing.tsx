import { createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PIN_LENGTH } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RefusingDocsExample = () => {
    const valueSignal = createSignal("");

    return (
        <>
            <TextInput
                value={valueSignal}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"PIN"}
                inputMode={"numeric"}
                hasError={() => valueSignal[0]().length > 0 && valueSignal[0]().length < PIN_LENGTH}
                onInput={(value) => {
                    valueSignal[1](value.replace(/\D/g, "").slice(0, PIN_LENGTH));
                }}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags}>Digits only</PageTextFieldPlaceholder>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: "${valueSignal[0]()}"`}
            </div>
        </>
    );
};
