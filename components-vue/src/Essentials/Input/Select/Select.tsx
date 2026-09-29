import { type SlotsType, computed, defineComponent, shallowRef, useId, watch } from "vue";

import {
    ListboxUtils,
    SELECT_DEFAULTS,
    type SelectFlags,
    SelectStyles,
    SelectUtils,
    TextFieldUtils,
} from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { TextSyncVueUtils } from "../../../Abstracts/TextSync/TextSyncVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Button } from "../../Button/Button";
import type { ButtonSlots } from "../../Button/Button.types";
import { FormFieldVueUtils } from "../FormField/FormFieldVue.utils";
import { useLabelContext } from "../Label/Label.context";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import { ListboxOptions } from "../Listbox/Listbox";
import type { ListboxOptionsSlots } from "../Listbox/Listbox.types";
import { ListboxVueUtils } from "../Listbox/ListboxVue.utils";
import type {
    SelectCompositeProps,
    SelectCompositeSlots,
    SelectFieldProps,
    SelectProps,
    SelectSlots,
} from "./Select.types";

const EMPTY_QUERY = "";
const EMPTY_SELECTION: never[] = [];

const SelectField = defineComponent(
    (props: SelectFieldProps, { slots, expose }: SlotsContext<InteractionControlSlots<SelectFlags>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const buttonRef = shallowRef<HTMLButtonElement>();
        const inputRef = shallowRef<HTMLInputElement>();

        exposeElement(expose, () => (props.isFilterable ? inputRef.value : buttonRef.value));

        const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncVueUtils.useValueSync(
            inputRef,
            () => props.query,
            { onInput: (query) => props.onQueryInput(query) },
        );

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const commonProps = {
                "aria-describedby": ariaDescribedBy.value,
                "aria-label": ariaLabel.value,
                "aria-disabled": isDisabled || undefined,
                "aria-required": props.isRequired || undefined,
                "aria-invalid": props.flags.hasError || undefined,
                ...ListboxUtils.computeComboboxAttributes({
                    isOpen: props.flags.isOpen,
                    listboxId: props.listboxId,
                    activeOptionId: props.activeOptionId,
                    isEditable: props.isFilterable,
                }),
            };

            const handleClick = () => {
                if (isDisabled) return;

                props.onToggle();
            };

            if (!props.isFilterable) {
                return (
                    <button
                        id={props.id}
                        ref={buttonRef}
                        type="button"
                        class={SelectStyles.selectField}
                        {...commonProps}
                        onKeydown={(e) => props.onKeyDown(e)}
                        onClick={handleClick}
                    >
                        {callSlot(slots.renderContent, props.flags)}
                    </button>
                );
            }

            return (
                <>
                    {callSlot(slots.renderContent, props.flags)}

                    <input
                        id={props.id}
                        ref={inputRef}
                        type="text"
                        class={SelectStyles.selectFilterField}
                        style={[props.textInset, props.computeTextStyle?.(props.flags)]}
                        autocomplete="off"
                        readonly={isDisabled}
                        {...commonProps}
                        onKeydown={(e) => props.onKeyDown(e)}
                        onClick={handleClick}
                        onInput={(e) => handleInput(e.currentTarget as HTMLInputElement)}
                        onCompositionstart={() => handleCompositionStart()}
                        onCompositionend={(e) => handleCompositionEnd(e.currentTarget as HTMLInputElement)}
                    />
                </>
            );
        };
    },
    {
        name: "SelectField",
        slots: Object as SlotsType<InteractionControlSlots<SelectFlags>>,
        props: declareProps<SelectFieldProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            listboxId: null,
            isRequired: Boolean,
            activeOptionId: null,
            isFilterable: Boolean,
            query: null,
            textInset: null,
            computeTextStyle: null,
            onToggle: null,
            onKeyDown: null,
            onQueryInput: null,
        }),
    },
);

export const SelectComposite = defineComponent(
    <T,>(props: SelectCompositeProps<T>, { slots }: SlotsContext<SelectCompositeSlots<T>>) => {
        const listboxId = useId();
        const fallbackFieldId = useId();

        const labelContext = useLabelContext();

        const fieldRef = shallowRef<HTMLElement>();
        const hasPopoverSettled = shallowRef(true);

        const isOpen = useTwoWay(props, "visibility", false);
        const query = useTwoWay(props, "query", undefined, { keepsOwnValue: false });

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsFilterable = () => props.query !== undefined;
        const getQuery = () => query.value ?? EMPTY_QUERY;

        watch(isOpen, (isShown) => {
            if (!isShown) hasPopoverSettled.value = false;
        });

        const open = () => {
            if (getIsDisabled()) return;

            isOpen.value = true;
        };

        const close = () => {
            isOpen.value = false;
        };

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isDisabled]) => {
            if (!isShown || !isDisabled) return;

            isOpen.value = false;
        });

        const cursor = ListboxVueUtils.useCursor<T>({
            focusModel: "activeDescendant",
            listboxId,
            options: () => props.options,
            selectedOptions: () => props.selectedOptions,
            isDisabled: getIsDisabled,
            isMultiple: () => props.isMultiple ?? false,
            isOpen,
            isFilterable: getIsFilterable,
            isFiltering: () => getQuery() !== EMPTY_QUERY,
            hasMoreOptions: () => props.hasMoreOptions ?? false,
            getComputeCustomText: () => props.computeCustomText,
            onOpen: open,
            onClose: close,
            onPick: (value) => props.onPick(value),
        });

        const clearValue = () => {
            if (getIsDisabled()) return;

            close();

            props.onClear();

            fieldRef.value?.focus();
        };

        FormFieldVueUtils.useRegisterControl(fieldRef);

        watchAfterRender([isOpen, hasPopoverSettled, getQuery], ([isShown, hasSettled, current]) => {
            if (!SelectUtils.getIsQueryClearDue(isShown, hasSettled, current)) return;

            query.value = EMPTY_QUERY;
        });

        const renderOptions = () => (
            <ListboxOptions
                cursor={cursor}
                isLive={isOpen.value}
                hasMoreOptions={props.hasMoreOptions}
                computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                computeIsSelected={props.computeIsSelected}
                onReachEnd={props.onReachEnd}
            >
                {
                    {
                        renderOption: slots.renderOption,
                        renderGroup: slots.renderGroup,
                    } satisfies Partial<ListboxOptionsSlots<T>>
                }
            </ListboxOptions>
        );

        return () => {
            const fieldId = props.id ?? fallbackFieldId;
            const isDisabled = getIsDisabled();
            const isMultiple = props.isMultiple ?? false;
            const isFilterable = getIsFilterable();

            const spreadPadding = TextFieldUtils.resolvePadding(props.padding ?? SELECT_DEFAULTS.padding);
            const textInset = CSSUtils.spreadableToStyle(spreadPadding, String);

            const extraFlags: SelectFlags = {
                isOpen: isOpen.value,
                isEmpty: props.selectedOptions.length < 1,
                isFiltering: getQuery() !== EMPTY_QUERY,
            };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <>
                                    <SelectField
                                        ref={(target) => {
                                            setElementRef(target);
                                            fieldRef.value = toElement(target);
                                        }}
                                        id={fieldId}
                                        ariaLabel={props.ariaLabel}
                                        isRequired={props.isRequired}
                                        listboxId={listboxId}
                                        activeOptionId={cursor.activeOptionId.value}
                                        isFilterable={isFilterable}
                                        query={getQuery()}
                                        textInset={textInset}
                                        flags={flags}
                                        computeTextStyle={props.computeTextStyle}
                                        onToggle={() => (isOpen.value && !isFilterable ? close() : open())}
                                        onKeyDown={cursor.handleKeyDown}
                                        onQueryInput={(next) => {
                                            open();
                                            cursor.highlight(undefined);

                                            query.value = next;
                                        }}
                                    >
                                        {
                                            {
                                                renderContent: (fieldFlags) =>
                                                    callSlot(slots.renderContent, {
                                                        selectedOptions: props.selectedOptions,
                                                        flags: fieldFlags,
                                                    }),
                                            } satisfies InteractionControlSlots<SelectFlags>
                                        }
                                    </SelectField>

                                    {slots.renderClear && props.selectedOptions.length > 0 && (
                                        <div
                                            class={SelectStyles.selectClear}
                                            style={{ right: `${spreadPadding.paddingRight}px` }}
                                        >
                                            <Button
                                                isDisabled={isDisabled}
                                                ariaLabel={props.clearAriaLabel}
                                                onClick={clearValue}
                                            >
                                                {
                                                    {
                                                        renderContent: (clearFlags) =>
                                                            callSlot(slots.renderClear, clearFlags),
                                                    } satisfies Partial<ButtonSlots>
                                                }
                                            </Button>
                                        </div>
                                    )}

                                    <Popover
                                        id={listboxId}
                                        role={"listbox"}
                                        ariaAttributes={SelectUtils.computeListAriaAttributes({
                                            listAriaLabel: props.listAriaLabel,
                                            labelId: labelContext.getLabelId(),
                                            fieldId,
                                            isMultiple,
                                        })}
                                        placement={props.placement}
                                        offset={props.offset}
                                        reservedScreenSize={props.reservedScreenSize}
                                        transitionDurationMs={props.transitionDurationMs}
                                        hasAnchorMinWidth={true}
                                        isOpen={isOpen.value}
                                        anchorRef={fieldRef.value}
                                        onDismiss={() => close()}
                                        onTransitionStatusChange={(hasTransitionFinished) => {
                                            hasPopoverSettled.value = hasTransitionFinished;
                                        }}
                                    >
                                        {
                                            {
                                                renderContent: (popup) =>
                                                    callSlot(slots.renderPopup, { renderOptions, ...popup, flags }),
                                            } satisfies PopoverSlots
                                        }
                                    </Popover>
                                </>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<SelectFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "SelectComposite",
        slots: Object as SlotsType<SelectCompositeSlots<any>>,
        props: declareProps<SelectCompositeProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "id": null,
            "ariaLabel": null,
            "listAriaLabel": null,
            "isRequired": Boolean,
            "placement": null,
            "offset": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "padding": null,
            "isMultiple": Boolean,
            "hasMoreOptions": Boolean,
            "computeTextStyle": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "query": null,
            "onUpdate:query": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "onReachEnd": null,
            "clearAriaLabel": null,
            "options": null,
            "selectedOptions": null,
            "computeIsSelected": null,
            "computeCustomText": null,
            "onPick": null,
            "onClear": null,
        }),
    },
);

export const Select = defineComponent(
    <T,>(props: SelectProps<T>, { slots }: SlotsContext<SelectSlots<T>>) => {
        const value = useTwoWay(props, "value");
        const visibility = useTwoWay(props, "visibility", false);
        const query = useTwoWay(props, "query", undefined, { keepsOwnValue: false });

        const selectedOptions = computed(() => {
            const selectedOption = SelectUtils.getFlatOptions(props.options).find(
                (option) => option.value === value.value,
            );

            return selectedOption ? [selectedOption] : EMPTY_SELECTION;
        });

        return () => (
            <SelectComposite
                {...{
                    ...forwardProps(props, SelectComposite),
                    "visibility": visibility.value,
                    "onUpdate:visibility": (isOpen: boolean) => {
                        visibility.value = isOpen;
                    },
                    "query": query.value,
                    "onUpdate:query": (next: string) => {
                        query.value = next;
                    },
                }}
                options={props.options}
                selectedOptions={selectedOptions.value}
                computeIsSelected={(candidate: T) => candidate === value.value}
                onPick={(picked: T) => {
                    if (picked === value.value) return;

                    value.value = picked;

                    props.onSelectionChange?.(picked);
                }}
                onClear={() => {
                    if (value.value === undefined) return;

                    value.value = undefined;

                    props.onSelectionChange?.(undefined);
                }}
            >
                {
                    {
                        renderContent: ({ selectedOptions: selected, flags }) =>
                            callSlot(slots.renderContent, { selectedOption: selected[0], flags }),
                        renderPopup: slots.renderPopup,
                        renderClear: slots.renderClear,
                        renderOption: slots.renderOption,
                        renderGroup: slots.renderGroup,
                        renderDecoration: slots.renderDecoration,
                    } satisfies Partial<SelectCompositeSlots<T>>
                }
            </SelectComposite>
        );
    },
    {
        name: "Select",
        slots: Object as SlotsType<SelectSlots<any>>,
        props: declareProps<SelectProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "id": null,
            "ariaLabel": null,
            "listAriaLabel": null,
            "isRequired": Boolean,
            "placement": null,
            "offset": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "padding": null,
            "hasMoreOptions": Boolean,
            "computeTextStyle": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "query": null,
            "onUpdate:query": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "onReachEnd": null,
            "clearAriaLabel": null,
            "options": null,
            "computeCustomText": null,
            "value": null,
            "onUpdate:value": null,
            "onSelectionChange": null,
        }),
    },
);
