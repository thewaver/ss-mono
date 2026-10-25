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

export const PasswordDocsExample = () => {
    const valueState = useState("");
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            type={isRevealed ? "text" : "password"}
            ariaLabel={"Password"}
            autoComplete={"current-password"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>Password</PageTextFieldPlaceholder>}
            renderTrailing={() => (
                <Button
                    onClick={() => {
                        setIsRevealed((prev) => !prev);
                    }}
                    renderContent={(flags) => (
                        <PageTextFieldAdornment flags={flags}>{isRevealed ? "Hide" : "Show"}</PageTextFieldAdornment>
                    )}
                />
            )}
        />
    );
};
