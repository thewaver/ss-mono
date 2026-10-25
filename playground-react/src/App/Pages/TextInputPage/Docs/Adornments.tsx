import { useState } from "react";

import { Button, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const AdornmentsDocsExample = () => {
    const valueState = useState("");

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Username"}
            autoComplete={"username"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>Username</PageTextFieldPlaceholder>}
            renderLeading={(flags) => (
                <PageTextFieldAdornment flags={flags}>
                    <span aria-hidden="true">👤︎</span>
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={valueState[0] === ""}
                    onClick={() => {
                        valueState[1]("");
                    }}
                    renderContent={(flags) => <PageTextFieldAdornment flags={flags}>Clear</PageTextFieldAdornment>}
                />
            )}
        />
    );
};
