import { useEffect, useRef, useState } from "react";

import { Button, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageInlineEditContent } from "../../../StyledComponents/InlineEditContent/InlineEditContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputEditableExampleProps } from "../TextInputPage.types";

type Props = TextInputEditableExampleProps;

export const EditableExample = (props: Props) => {
    const draftState = useState("");

    const buttonRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLElement>(null);
    const isEditingRef = useRef(props.editing[0]);
    const focusedForRef = useRef(props.editing[0]);

    const isEditing = props.editing[0];

    isEditingRef.current = isEditing;

    const startEditing = () => {
        draftState[1](props.value[0]);
        isEditingRef.current = true;
        props.editing[1](true);
    };

    const finishEditing = (isCommitting: boolean) => {
        if (!isEditingRef.current) return;

        isEditingRef.current = false;

        if (isCommitting) props.value[1](draftState[0]);

        props.editing[1](false);
    };

    useEffect(() => {
        if (focusedForRef.current === isEditing) return;

        focusedForRef.current = isEditing;

        (isEditing ? inputRef : buttonRef).current?.focus();
    }, [isEditing]);

    if (!isEditing) {
        return (
            <Button
                ref={(element) => {
                    buttonRef.current = element;
                }}
                ariaLabel={`Edit name, ${props.value[0]}`}
                onClick={startEditing}
                renderContent={(flags) => (
                    <PageInlineEditContent flags={flags}>{props.value[0]}</PageInlineEditContent>
                )}
            />
        );
    }

    return (
        <div
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    finishEditing(true);
                }

                if (e.key === "Escape") {
                    e.preventDefault();
                    finishEditing(false);
                }
            }}
            onBlur={() => finishEditing(true)}
        >
            <TextInput
                ref={(element) => {
                    inputRef.current = element;
                }}
                value={draftState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Name"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            />
        </div>
    );
};
