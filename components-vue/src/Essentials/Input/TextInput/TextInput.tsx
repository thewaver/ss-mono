import { type SlotsType, computed, defineComponent, shallowRef, useId } from "vue";

import { ListboxUtils } from "@thewaver/ss-components";

import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { ListboxOptions } from "../Listbox/Listbox";
import type { ListboxOptionsSlots } from "../Listbox/Listbox.types";
import { ListboxVueUtils } from "../Listbox/ListboxVue.utils";
import type { SelectOption } from "../Select/Select.types";
import type { TextInputProps, TextInputSlots } from "./TextInput.types";

const EMPTY_SELECTION: never[] = [];
const NO_AUTOCOMPLETE = "off";

export const TextInput = defineComponent(
    <T = string,>(props: TextInputProps<T>, { slots, expose }: SlotsContext<TextInputSlots<T>>) => {
        const listboxId = useId();

        const value = useTwoWay(props, "value", "");

        const fieldElement = shallowRef<HTMLElement>();
        const isWanted = shallowRef(false);

        exposeElement(expose, () => fieldElement.value);

        const getHasSuggestions = () => props.suggestions !== undefined;
        const getIsRefused = () => !getHasSuggestions() || (props.isDisabled ?? false) || (props.isReadOnly ?? false);

        const options = computed((): SelectOption<T>[] =>
            props.suggestions === undefined
                ? EMPTY_SELECTION
                : props.suggestions.map((suggestion) => ({ value: suggestion })),
        );

        const isOpen = computed(() => isWanted.value && !getIsRefused() && options.value.length > 0);

        const open = () => {
            if (getIsRefused()) return;

            isWanted.value = true;
        };

        const close = () => {
            isWanted.value = false;
        };

        const writeSuggestion = (suggestion: T) => {
            const index = cursor.flatOptions.value.findIndex((option) => option.value === suggestion);
            const text = ListboxUtils.computePickedText(
                listboxId,
                index,
                props.computeCustomSuggestionText?.(suggestion),
            );

            value.value = text;

            props.onInput?.(text);
            props.onSuggestionPick?.(suggestion);
        };

        const cursor = ListboxVueUtils.useCursor<T>({
            focusModel: "activeDescendant",
            isHighlightExplicit: true,
            listboxId,
            options,
            selectedOptions: EMPTY_SELECTION,
            isDisabled: getIsRefused,
            isOpen,
            isFilterable: true,
            isFiltering: true,
            onOpen: open,
            onClose: close,
            onPick: (suggestion) => writeSuggestion(suggestion),
        });

        const renderSuggestions = () => (
            <ListboxOptions cursor={cursor} isLive={isOpen.value} computeIsSelected={() => false}>
                {
                    {
                        renderOption: ({ option, flags }) =>
                            callSlot(slots.renderSuggestion, { suggestion: option.value, flags }),
                    } satisfies ListboxOptionsSlots<T>
                }
            </ListboxOptions>
        );

        return () => {
            const hasSuggestions = getHasSuggestions();

            return (
                <>
                    <TextField
                        {...{
                            ...forwardProps(props, TextField),
                            "value": value.value,
                            "onUpdate:value": (next: string) => {
                                value.value = next;
                            },
                            "onInput": (next: string) => {
                                if (hasSuggestions) {
                                    open();
                                    cursor.highlight(undefined);
                                }

                                props.onInput?.(next);
                            },
                        }}
                        ref={(target) => {
                            fieldElement.value = toElement(target);
                        }}
                        element={"input"}
                        autoComplete={props.autoComplete ?? (hasSuggestions ? NO_AUTOCOMPLETE : undefined)}
                        ariaAttributes={
                            hasSuggestions
                                ? ListboxUtils.computeComboboxAttributes({
                                      isOpen: isOpen.value,
                                      listboxId,
                                      activeOptionId: cursor.activeOptionId.value,
                                      isEditable: true,
                                  })
                                : undefined
                        }
                        onKeyDown={(e) => cursor.handleKeyDown(e)}
                    >
                        {
                            {
                                renderContent: slots.renderContent,
                                renderPlaceholder: slots.renderPlaceholder,
                                renderLeading: slots.renderLeading,
                                renderTrailing: slots.renderTrailing,
                                renderDecoration: slots.renderDecoration,
                            } satisfies Partial<TextFieldSlots>
                        }
                    </TextField>

                    {hasSuggestions && (
                        <Popover
                            id={listboxId}
                            role={"listbox"}
                            ariaAttributes={{ "aria-label": props.suggestionsAriaLabel }}
                            hasAnchorMinWidth={true}
                            isOpen={isOpen.value}
                            anchorRef={fieldElement.value}
                            onDismiss={close}
                        >
                            {
                                {
                                    renderContent: ({ visibilityTarget, transitionDurationMs, placement }) =>
                                        callSlot(slots.renderSuggestionPopup, {
                                            renderSuggestions,
                                            visibilityTarget,
                                            transitionDurationMs,
                                            placement,
                                        }),
                                } satisfies PopoverSlots
                            }
                        </Popover>
                    )}
                </>
            );
        };
    },
    {
        name: "TextInput",
        inheritAttrs: false,
        slots: Object as SlotsType<TextInputSlots<any>>,
        props: declareProps<TextInputProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "computeMaskedText": null,
            "computeTextStyle": null,
            "onInput": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "type": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "autoComplete": null,
            "inputMode": null,
            "placeholderHint": null,
            "min": null,
            "max": null,
            "step": null,
            "padding": null,
            "gap": null,
            "value": null,
            "onUpdate:value": null,
            "suggestions": null,
            "suggestionsAriaLabel": null,
            "computeCustomSuggestionText": null,
            "onSuggestionPick": null,
        }),
    },
);
