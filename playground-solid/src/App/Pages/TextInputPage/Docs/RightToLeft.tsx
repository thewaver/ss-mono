import { createSignal } from "solid-js";

import { Button, TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import { PageIcon } from "../../../StyledComponents/Icon/Icon";
import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import { PageTextFieldButtonContent } from "../../../StyledComponents/TextFieldButtonContent/TextFieldButtonContent";
import { PageTextFieldContent } from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal("");

    return (
        <div dir={"rtl"}>
            <TextInput
                value={valueSignal}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Username"}
                autoComplete={"username"}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags}>Username</PageTextFieldPlaceholder>
                )}
                renderLeading={(getFlags) => (
                    <PageTextFieldAdornment flags={getFlags}>
                        <PageIcon src={person} />
                    </PageTextFieldAdornment>
                )}
                renderTrailing={() => (
                    <Button
                        isDisabled={() => valueSignal[0]() === ""}
                        onClick={() => {
                            valueSignal[1]("");
                        }}
                        renderContent={(getFlags) => (
                            <PageTextFieldButtonContent flags={getFlags}>Clear</PageTextFieldButtonContent>
                        )}
                    />
                )}
            />
        </div>
    );
};
