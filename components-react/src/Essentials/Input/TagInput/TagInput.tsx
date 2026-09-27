import { type KeyboardEvent, useCallback, useRef } from "react";

import {
    TAG_INPUT_DEFAULTS,
    type TagInputFlags,
    type TagInputKeyAction,
    TagInputStyles,
    TagInputUtils,
} from "@thewaver/ss-components";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { FormFieldReactUtils } from "../FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import type { TagInputFieldElementProps, TagInputProps } from "./TagInput.types";

const EMPTY_TEXT = "";

const TagInputFieldElement = (props: TagInputFieldElementProps) => {
    const { fieldRef, ref } = props;

    const setRef = useCallback(
        (element: HTMLInputElement | null) => {
            fieldRef.current = element;
            ref(element);
        },
        [fieldRef, ref],
    );

    return (
        <input
            ref={setRef}
            id={props.id}
            type="text"
            name={props.name}
            className={TagInputStyles.tagInputField}
            style={props.style}
            value={props.value}
            readOnly={props.isDisabled}
            aria-label={props.ariaLabel}
            aria-describedby={props.ariaDescribedBy}
            aria-disabled={props.isDisabled || undefined}
            onChange={(e) => props.onChange(e.currentTarget.value)}
            onKeyDown={props.onKeyDown}
        />
    );
};

export const TagInput = (props: TagInputProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const [tags, setTagsState] = props.valueState;

    const fieldRef = useRef<HTMLInputElement | null>(null);
    const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);

    FormFieldReactUtils.useRegisterControl(fieldRef);

    const direction = NavigatorReactUtils.useDirection(fieldRef);

    const [text, setText] = SignalMirrorReactUtils.useOptionalState(props.textState, EMPTY_TEXT);

    const isDisabled = props.isDisabled ?? false;
    const isEmpty = text.length < 1;

    const setTags = (next: string[]) => {
        setTagsState(next);

        props.onTagsChange?.(next);
    };

    const focusTag = (index: number) => {
        tagRefs.current[index]?.focus();
    };

    const focusField = () => {
        fieldRef.current?.focus();
    };

    const addTag = () => {
        const tag = TagInputUtils.computeTag(text, props.computeTag);

        if (!tag) return;

        setTags([...tags, tag]);
        setText(EMPTY_TEXT);
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, position) => position !== index));

        const next = TagInputUtils.computeFocusAfterRemoval(index, tags.length);

        if (next === undefined) focusField();
        else focusTag(next);
    };

    const runKeyAction = (e: KeyboardEvent, action: TagInputKeyAction | undefined) => {
        if (!action) return;

        if (TagInputUtils.getIsKeyTaken(action)) e.preventDefault();

        if (action.kind === "add") addTag();
        else if (action.kind === "remove") removeTag(action.index);
        else if (action.kind === "focusTag") focusTag(action.index);
        else focusField();
    };

    const extraFlags: TagInputFlags = { isEmpty, hasTags: tags.length > 0 };

    return (
        <InteractionWrapper<TagInputFlags>
            {...props}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <>
                    {props.renderContent(flags)}

                    <div
                        className={TagInputStyles.tagInputRoot}
                        style={{
                            gap: `${props.gap ?? TAG_INPUT_DEFAULTS.gap}px`,
                            padding: `${props.padding ?? TAG_INPUT_DEFAULTS.padding}px`,
                        }}
                        role="group"
                        aria-label={props.ariaLabel}
                        onPointerDown={(e) => {
                            if (e.target !== e.currentTarget || isDisabled) return;

                            e.preventDefault();
                            focusField();
                        }}
                        onMouseEnter={(e) => {
                            if (isDisabled) return;

                            props.onMouseEnter?.(e);
                        }}
                        onMouseLeave={(e) => {
                            if (isDisabled) return;

                            props.onMouseLeave?.(e);
                        }}
                    >
                        {tags.map((tag, index) => (
                            <InteractionWrapper
                                key={index}
                                isDisabled={flags.isDisabled ?? false}
                                isTabbable={false}
                                renderControl={(setTagRef, tagFlags) => (
                                    <button
                                        type="button"
                                        ref={(element) => {
                                            tagRefs.current[index] = element;
                                            setTagRef(element);
                                        }}
                                        className={TagInputStyles.tagInputTag}
                                        aria-label={props.computeTagAriaLabel?.(tag) ?? tag}
                                        aria-disabled={tagFlags.isDisabled || undefined}
                                        onClick={() => {
                                            if (tagFlags.isDisabled) return;

                                            removeTag(index);
                                        }}
                                        onKeyDown={(e) => {
                                            if (isDisabled) return;

                                            runKeyAction(
                                                e,
                                                TagInputUtils.computeTagKeyAction(e, index, {
                                                    tagCount: tags.length,
                                                    direction,
                                                }),
                                            );
                                        }}
                                    >
                                        {props.renderTag(tag, tagFlags)}
                                    </button>
                                )}
                            />
                        ))}

                        <TagInputFieldElement
                            ref={setElementRef}
                            fieldRef={fieldRef}
                            id={props.id}
                            name={props.name}
                            style={props.computeTextStyle?.(flags)}
                            value={text}
                            isDisabled={flags.isDisabled ?? false}
                            ariaLabel={ariaLabel}
                            ariaDescribedBy={ariaDescribedBy}
                            onChange={setText}
                            onKeyDown={(e) => {
                                if (isDisabled) return;

                                runKeyAction(
                                    e,
                                    TagInputUtils.computeFieldKeyAction(e.key, {
                                        isEmpty,
                                        tagCount: tags.length,
                                        direction,
                                    }),
                                );
                            }}
                        />

                        {props.renderPlaceholder && isEmpty && tags.length < 1 && (
                            <div className={TagInputStyles.tagInputPlaceholder}>{props.renderPlaceholder(flags)}</div>
                        )}
                    </div>
                </>
            )}
        />
    );
};
