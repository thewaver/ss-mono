import { createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RewritingDocsExample = () => {
    const valueSignal = createSignal("");

    return (
        <>
            <TextInput
                value={valueSignal}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Coupon code"}
                onInput={(value) => {
                    valueSignal[1](value.toLocaleUpperCase());
                }}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags}>Coupon code (upper-cased)</PageTextFieldPlaceholder>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: "${valueSignal[0]()}"`}
            </div>
        </>
    );
};
