import { Index, Show, createMemo, createSignal } from "solid-js";

import {
    TAG_INPUT_DEFAULTS,
    type TagInputKeyAction,
    TagInputUtils,
    TagInputStyles as styles,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import { FormFieldSolidUtils } from "../FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../Label/LabelSolid.utils";
import type { TagInputProps } from "./TagInputSolid.types";

export const TagInput = (props: TagInputProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const valueSignal = accessSignal(() => props.value);

    const [getFieldRef, setFieldRef] = createSignal<HTMLInputElement>();

    FormFieldSolidUtils.registerControl(getFieldRef);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getFieldRef);

    let tagRefs: (HTMLElement | undefined)[] = [];

    const textSignal = SignalMirrorSolidUtils.createOptional(() => props.text, "");

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getTags = () => valueSignal[0]();

    const getIsEmpty = createMemo(() => textSignal[0]().length < 1);

    const setTags = (tags: string[]) => {
        valueSignal[1](() => tags);

        void props.onTagsChange?.(tags);
    };

    const focusTag = (index: number) => {
        tagRefs[index]?.focus();
    };

    const focusField = () => {
        getFieldRef()?.focus();
    };

    const addTag = () => {
        const text = textSignal[0]();
        const tag = TagInputUtils.computeTag(text, props.computeTag);

        if (!tag) return;

        setTags([...getTags(), tag]);
        textSignal[1]("");
    };

    const removeTag = (index: number) => {
        const tags = getTags();

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

    const handleFieldKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        runKeyAction(
            e,
            TagInputUtils.computeFieldKeyAction(e.key, {
                isEmpty: getIsEmpty(),
                tagCount: getTags().length,
                direction: getDirection(),
            }),
        );
    };

    const handleTagKeyDown = (e: KeyboardEvent, index: number) => {
        if (getIsDisabled()) return;

        runKeyAction(
            e,
            TagInputUtils.computeTagKeyAction(e, index, { tagCount: getTags().length, direction: getDirection() }),
        );
    };

    return (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({ isEmpty: getIsEmpty(), hasTags: getTags().length > 0 })}
            renderControl={(setElementRef, getFlags) => (
                <>
                    {props.renderContent?.(getFlags)}

                    <div
                        class={styles.tagInputRoot}
                        style={{
                            gap: `${access(props.gap) ?? TAG_INPUT_DEFAULTS.gap}px`,
                            padding: `${access(props.padding) ?? TAG_INPUT_DEFAULTS.padding}px`,
                        }}
                        role="group"
                        aria-label={access(props.ariaLabel)}
                        onPointerDown={(e) => {
                            if (e.target !== e.currentTarget || getIsDisabled()) return;

                            e.preventDefault();
                            focusField();
                        }}
                        onMouseEnter={(e) => {
                            if (getIsDisabled()) return;

                            void props.onMouseEnter?.(e);
                        }}
                        onMouseLeave={(e) => {
                            if (getIsDisabled()) return;

                            void props.onMouseLeave?.(e);
                        }}
                    >
                        <Index each={getTags()}>
                            {(getTag, index) => (
                                <InteractionWrapper
                                    isDisabled={() => getFlags().isDisabled ?? false}
                                    isTabbable={false}
                                    renderControl={(setTagRef, getTagFlags) => (
                                        <button
                                            type="button"
                                            ref={(element) => {
                                                tagRefs[index] = element;
                                                setTagRef(element);
                                            }}
                                            class={styles.tagInputTag}
                                            aria-label={props.computeTagAriaLabel?.(getTag()) ?? getTag()}
                                            aria-disabled={getTagFlags().isDisabled || undefined}
                                            onClick={() => {
                                                if (getTagFlags().isDisabled) return;

                                                removeTag(index);
                                            }}
                                            onKeyDown={(e) => handleTagKeyDown(e, index)}
                                        >
                                            {props.renderTag(getTag, getTagFlags)}
                                        </button>
                                    )}
                                />
                            )}
                        </Index>

                        <input
                            ref={(element) => {
                                setFieldRef(element);
                                setElementRef(element);
                            }}
                            id={access(props.id)}
                            type="text"
                            name={access(props.name)}
                            class={styles.tagInputField}
                            style={props.computeTextStyle?.(getFlags)}
                            value={textSignal[0]()}
                            readOnly={getFlags().isDisabled}
                            aria-label={getAriaLabel()}
                            aria-describedby={getAriaDescribedBy()}
                            aria-disabled={getFlags().isDisabled || undefined}
                            onInput={(e) => textSignal[1](e.currentTarget.value)}
                            onKeyDown={handleFieldKeyDown}
                        />

                        <Show when={props.renderPlaceholder && getIsEmpty() && getTags().length < 1}>
                            <div class={styles.tagInputPlaceholder}>{props.renderPlaceholder!(getFlags)}</div>
                        </Show>
                    </div>
                </>
            )}
        />
    );
};
