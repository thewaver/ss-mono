import { Index, Show, createMemo, createSignal } from "solid-js";

import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import { FormFieldUtils } from "../FormField/FormField.utils";
import { LabelUtils } from "../Label/Label.utils";
import { TAG_INPUT_DEFAULTS } from "./TagInput.const";
import type { TagInputProps } from "./TagInput.types";

import * as styles from "./TagInput.css";

export const TagInput = (props: TagInputProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldUtils.resolveAriaDescribedBy();

    const valueSignal = accessSignal(() => props.valueSignal);

    const [getFieldRef, setFieldRef] = createSignal<HTMLInputElement>();

    FormFieldUtils.registerControl(getFieldRef);

    const getDirection = NavigatorUtils.createDirectionSignal(getFieldRef);

    let tagRefs: (HTMLElement | undefined)[] = [];

    const textSignal = SignalMirrorUtils.createOptional(() => props.textSignal, "");

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
        const tag = props.computeTag ? props.computeTag(text) : text.trim();

        if (!tag) return;

        setTags([...getTags(), tag]);
        textSignal[1]("");
    };

    const removeTag = (index: number) => {
        const tags = getTags();

        setTags(tags.filter((_, position) => position !== index));

        if (index > 0) {
            focusTag(index - 1);
            return;
        }

        if (tags.length > 1) {
            focusTag(0);
            return;
        }

        focusField();
    };

    const handleFieldKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
            return;
        }

        if (!getIsEmpty() || getTags().length < 1) return;

        if (e.key === "Backspace" || NavigatorUtils.computeLogicalKey(e.key, getDirection()) === "ArrowLeft") {
            e.preventDefault();
            focusTag(getTags().length - 1);
        }
    };

    const handleTagKeyDown = (e: KeyboardEvent, index: number) => {
        if (getIsDisabled()) return;

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            focusField();
            return;
        }

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            removeTag(index);
            return;
        }

        const logicalKey = NavigatorUtils.computeLogicalKey(e.key, getDirection());

        if (logicalKey === "ArrowLeft" && index > 0) {
            e.preventDefault();
            focusTag(index - 1);
            return;
        }

        if (logicalKey === "ArrowRight") {
            e.preventDefault();

            if (index < getTags().length - 1) {
                focusTag(index + 1);
                return;
            }

            focusField();
        }
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
