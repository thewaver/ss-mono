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

export const EditableDocsExample = () => {
    const [value, setValue] = useState("Ada Lovelace");
    const [isEditing, setIsEditing] = useState(false);
    const draftState = useState("");

    const buttonRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLElement>(null);
    const isEditingRef = useRef(isEditing);
    const focusedForRef = useRef(isEditing);

    isEditingRef.current = isEditing;

    const startEditing = () => {
        draftState[1](value);
        isEditingRef.current = true;
        setIsEditing(true);
    };

    const finishEditing = (isCommitting: boolean) => {
        if (!isEditingRef.current) return;

        isEditingRef.current = false;

        if (isCommitting) setValue(draftState[0]);

        setIsEditing(false);
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
                ariaLabel={`Edit name, ${value}`}
                onClick={startEditing}
                renderContent={(flags) => <PageInlineEditContent flags={flags}>{value}</PageInlineEditContent>}
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
