import { createSignal } from "solid-js";

import { Button, TextInput } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal("");

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Username"}
            autoComplete={"username"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            renderPlaceholder={(getFlags) => (
                <PageTextFieldPlaceholder flags={getFlags}>Username</PageTextFieldPlaceholder>
            )}
            renderLeading={(getFlags) => (
                <PageTextFieldAdornment flags={getFlags}>
                    <span aria-hidden="true">👤︎</span>
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={() => valueSignal[0]() === ""}
                    onClick={() => {
                        valueSignal[1]("");
                    }}
                    renderContent={(getFlags) => (
                        <PageTextFieldAdornment flags={getFlags}>Clear</PageTextFieldAdornment>
                    )}
                />
            )}
        />
    );
};
