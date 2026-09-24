import { Show, createEffect, createSignal, on } from "solid-js";

import { Button, TextInput } from "@thewaver/ss-components";

import { PageInlineEditContent } from "../../../StyledComponents/InlineEditContent/InlineEditContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputEditableExampleProps } from "../TextInputPage.types";

import { FIELD_GAP, FIELD_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = TextInputEditableExampleProps;

export const EditableExample = (props: Props) => {
    const draftSignal = createSignal("");

    let buttonRef: HTMLElement | undefined;
    let inputRef: HTMLElement | undefined;

    const startEditing = () => {
        draftSignal[1](props.valueSignal[0]());
        props.editingSignal[1](true);
    };

    const finishEditing = (isCommitting: boolean) => {
        if (!props.editingSignal[0]()) return;

        if (isCommitting) props.valueSignal[1](draftSignal[0]());

        props.editingSignal[1](false);
    };

    createEffect(
        on(
            () => props.editingSignal[0](),
            (isEditing) => {
                (isEditing ? inputRef : buttonRef)?.focus();
            },
            { defer: true },
        ),
    );

    return (
        <Show
            when={props.editingSignal[0]()}
            fallback={
                <Button
                    ref={(element) => {
                        buttonRef = element;
                    }}
                    ariaLabel={() => `Edit name, ${props.valueSignal[0]()}`}
                    onClick={startEditing}
                    renderContent={(getFlags) => (
                        <PageInlineEditContent flags={getFlags}>{props.valueSignal[0]()}</PageInlineEditContent>
                    )}
                />
            }
        >
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
                onFocusOut={() => finishEditing(true)}
            >
                <TextInput
                    ref={(element) => {
                        inputRef = element;
                    }}
                    valueSignal={draftSignal}
                    padding={() => FIELD_PADDING}
                    gap={() => FIELD_GAP}
                    ariaLabel={"Name"}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                />
            </div>
        </Show>
    );
};
