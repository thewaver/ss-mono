import { type SlotsType, defineComponent, shallowRef } from "vue";

import {
    TAG_INPUT_DEFAULTS,
    type TagInputFlags,
    type TagInputKeyAction,
    TagInputStyles,
    TagInputUtils,
} from "@thewaver/ss-components";

import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { FormFieldVueUtils } from "../FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import type { TagInputProps, TagInputSlots } from "./TagInput.types";

const EMPTY_TEXT = "";

export const TagInput = defineComponent(
    (props: TagInputProps, { slots, expose }: SlotsContext<TagInputSlots>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const tags = useTwoWay(props, "value", []);
        const text = useTwoWay(props, "text", EMPTY_TEXT);

        const fieldRef = shallowRef<HTMLInputElement>();
        const tagRefs: (HTMLElement | undefined)[] = [];
        const typeCount = shallowRef(0);

        exposeElement(expose, () => fieldRef.value);

        FormFieldVueUtils.useRegisterControl(fieldRef);

        const direction = NavigatorVueUtils.useDirection(fieldRef);

        watchAfterRender([typeCount], () => {
            const field = fieldRef.value;

            if (field && field.value !== text.value) field.value = text.value;
        });

        const getIsDisabled = () => props.isDisabled ?? false;

        const setTags = (next: string[]) => {
            tags.value = next;

            props.onTagsChange?.(next);
        };

        const focusTag = (index: number) => {
            tagRefs[index]?.focus();
        };

        const focusField = () => {
            fieldRef.value?.focus();
        };

        const addTag = () => {
            const tag = TagInputUtils.computeTag(text.value, props.computeTag);

            if (!tag) return;

            setTags([...tags.value, tag]);
            text.value = EMPTY_TEXT;
        };

        const removeTag = (index: number) => {
            const tagCount = tags.value.length;

            setTags(tags.value.filter((_, position) => position !== index));

            const next = TagInputUtils.computeFocusAfterRemoval(index, tagCount);

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

        return () => {
            const isDisabled = getIsDisabled();
            const isEmpty = text.value.length < 1;
            const tagCount = tags.value.length;

            const extraFlags: TagInputFlags = { isEmpty, hasTags: tagCount > 0 };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => [
                                callSlot(slots.renderContent, flags),
                                <div
                                    class={TagInputStyles.tagInputRoot}
                                    style={{
                                        gap: `${props.gap ?? TAG_INPUT_DEFAULTS.gap}px`,
                                        padding: `${props.padding ?? TAG_INPUT_DEFAULTS.padding}px`,
                                    }}
                                    role="group"
                                    aria-label={props.ariaLabel}
                                    onPointerdown={(e) => {
                                        if (e.target !== e.currentTarget || isDisabled) return;

                                        e.preventDefault();
                                        focusField();
                                    }}
                                    onMouseenter={(e) => {
                                        if (isDisabled) return;

                                        props.onMouseEnter?.(e);
                                    }}
                                    onMouseleave={(e) => {
                                        if (isDisabled) return;

                                        props.onMouseLeave?.(e);
                                    }}
                                >
                                    {tags.value.map((tag, index) => (
                                        <InteractionWrapper
                                            key={index}
                                            isDisabled={flags.isDisabled ?? false}
                                            isTabbable={false}
                                        >
                                            {
                                                {
                                                    renderControl: ({ setElementRef: setTagRef, flags: tagFlags }) => (
                                                        <button
                                                            type="button"
                                                            ref={(target) => {
                                                                tagRefs[index] = toElement(target);
                                                                setTagRef(target);
                                                            }}
                                                            class={TagInputStyles.tagInputTag}
                                                            aria-label={props.computeTagAriaLabel?.(tag) ?? tag}
                                                            aria-disabled={tagFlags.isDisabled || undefined}
                                                            onClick={() => {
                                                                if (tagFlags.isDisabled) return;

                                                                removeTag(index);
                                                            }}
                                                            onKeydown={(e) => {
                                                                if (isDisabled) return;

                                                                runKeyAction(
                                                                    e,
                                                                    TagInputUtils.computeTagKeyAction(e, index, {
                                                                        tagCount,
                                                                        direction: direction.value,
                                                                    }),
                                                                );
                                                            }}
                                                        >
                                                            {callSlot(slots.renderTag, { tag, flags: tagFlags })}
                                                        </button>
                                                    ),
                                                } satisfies Partial<InteractionWrapperSlots>
                                            }
                                        </InteractionWrapper>
                                    ))}

                                    <input
                                        ref={(target) => {
                                            fieldRef.value = toElement<HTMLInputElement>(target);
                                            setElementRef(target);
                                        }}
                                        id={props.id}
                                        type="text"
                                        name={props.name}
                                        class={TagInputStyles.tagInputField}
                                        style={props.computeTextStyle?.(flags)}
                                        value={text.value}
                                        readonly={flags.isDisabled ?? false}
                                        aria-label={ariaLabel.value}
                                        aria-describedby={ariaDescribedBy.value}
                                        aria-disabled={flags.isDisabled || undefined}
                                        onInput={(e) => {
                                            text.value = (e.currentTarget as HTMLInputElement).value;
                                            typeCount.value += 1;
                                        }}
                                        onKeydown={(e) => {
                                            if (isDisabled) return;

                                            runKeyAction(
                                                e,
                                                TagInputUtils.computeFieldKeyAction(e.key, {
                                                    isEmpty,
                                                    tagCount,
                                                    direction: direction.value,
                                                }),
                                            );
                                        }}
                                    />

                                    {slots.renderPlaceholder && isEmpty && tagCount < 1 && (
                                        <div class={TagInputStyles.tagInputPlaceholder}>
                                            {callSlot(slots.renderPlaceholder, flags)}
                                        </div>
                                    )}
                                </div>,
                            ],
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<TagInputFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "TagInput",
        slots: Object as SlotsType<TagInputSlots>,
        props: declareProps<TagInputProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "computeTag": null,
            "computeTagAriaLabel": null,
            "onTagsChange": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "padding": null,
            "gap": null,
            "value": null,
            "onUpdate:value": null,
            "text": null,
            "onUpdate:text": null,
            "computeTextStyle": null,
        }),
    },
);
