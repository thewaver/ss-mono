import type { JSX } from "solid-js";
import { Show, batch, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    FormValueUtils,
    ListboxUtils,
    SELECT_DEFAULTS,
    SelectUtils,
    TextFieldUtils,
    SelectStyles as styles,
} from "@thewaver/ss-components";
import { SelectConst } from "@thewaver/ss-components/internal";
import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { TextSyncSolidUtils } from "../../../Abstracts/TextSync/TextSyncSolid.utils";
import { FormValue } from "../../../Primitives/FormValue/FormValue";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access, accessSignal } from "../../../Utils/propUtils";
import { Button } from "../../Buttons/Button/Button";
import { FormFieldSolidUtils } from "../FormField/FormFieldSolid.utils";
import { useLabelContext } from "../Label/Label.context";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxSolidUtils } from "../Listbox/ListboxSolid.utils";
import type { SelectCompositeProps, SelectFieldProps, SelectProps } from "./SelectSolid.types";

const EMPTY_FORM_VALUE = "";

const SelectField = (props: SelectFieldProps) => {
    const { getAriaLabel, getAriaLabelledBy } = FormFieldSolidUtils.resolveAriaName(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<HTMLInputElement>();
    const [getContentRef, setContentRef] = createSignal<HTMLElement>();
    const [getPaintedText, setPaintedText] = createSignal(SelectConst.EMPTY_QUERY);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsEditing = () => access(props.isEditing);

    createEffect(() => {
        const element = getContentRef();
        const isFilterable = access(props.isFilterable);

        if (!element || !isFilterable) return;

        const read = () => setPaintedText(SelectUtils.computePaintedText(element));
        const observer = new MutationObserver(read);

        read();
        observer.observe(element, { childList: true, subtree: true, characterData: true });

        onCleanup(() => observer.disconnect());
    });

    const getValueText = () =>
        access(props.flags).isEmpty ? SelectConst.EMPTY_QUERY : (access(props.valueText) ?? getPaintedText());

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncSolidUtils.createValueSync(
        getElementRef,
        () => (getIsEditing() ? access(props.query) : getValueText()),
        { onInput: props.onQueryInput },
    );

    const selectValueText = (element: HTMLInputElement) => {
        if (getIsEditing()) return;

        element.select();
    };

    const getComboboxAttributes = createMemo(() =>
        ListboxUtils.computeComboboxAttributes({
            isOpen: access(props.flags).isOpen,
            listboxId: access(props.listboxId),
            activeOptionId: access(props.activeOptionId),
            isEditable: access(props.isFilterable),
        }),
    );

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        get "aria-describedby"() {
            return getAriaDescribedBy();
        },
        get "aria-label"() {
            return getAriaLabel();
        },
        get "aria-labelledby"() {
            return getAriaLabelledBy();
        },
        get "aria-disabled"() {
            return getIsDisabled() || undefined;
        },
        get "aria-required"() {
            return access(props.isRequired) || undefined;
        },
        get "aria-invalid"() {
            return access(props.flags).hasError || undefined;
        },
        "onKeyDown": props.onKeyDown,
    };

    return (
        <Show
            when={access(props.isFilterable)}
            fallback={
                <button
                    id={access(props.id)}
                    ref={(element) => props.ref?.(element)}
                    type="button"
                    class={styles.selectField}
                    {...commonProps}
                    {...getComboboxAttributes()}
                    onClick={() => {
                        if (getIsDisabled()) return;

                        props.onToggle();
                    }}
                >
                    {props.renderContent(() => access(props.flags))}
                </button>
            }
        >
            <span ref={setContentRef} class={styles.selectFieldContent}>
                {props.renderContent(() => access(props.flags))}
            </span>

            <input
                id={access(props.id)}
                ref={(element) => {
                    setElementRef(element);
                    props.ref?.(element);
                }}
                type="text"
                class={styles.selectFilterField}
                classList={{ [styles.selectFilterFieldShowsValue]: !getIsEditing() }}
                style={{ ...access(props.textInset), ...props.computeTextStyle?.(() => access(props.flags)) }}
                autocomplete="off"
                readOnly={getIsDisabled()}
                {...commonProps}
                {...getComboboxAttributes()}
                onFocus={(e) => selectValueText(e.currentTarget)}
                onClick={(e) => {
                    if (getIsDisabled()) return;

                    selectValueText(e.currentTarget);
                    props.onToggle();
                }}
                onInput={(e) => handleInput(e.currentTarget)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget)}
            />
        </Show>
    );
};

export const SelectComposite = <T,>(props: SelectCompositeProps<T>) => {
    const listboxId = createUniqueId();
    const fallbackFieldId = createUniqueId();

    const labelContext = useLabelContext();
    const getCaptionId = FormFieldSolidUtils.resolveAriaLabelledBy();

    const getFieldId = () => access(props.id) ?? fallbackFieldId;

    const getListAriaLabel = () => access(props.listAriaLabel);

    const [getFieldRef, setFieldRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);
    const [getHasPopoverSettled, setHasPopoverSettled] = createSignal(true);
    const [getIsEditing, setIsEditing] = createSignal(false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsMultiple = createMemo(() => access(props.isMultiple) ?? false);

    const getIsFilterable = createMemo(() => props.query !== undefined);

    const getQuery = createMemo(() => props.query?.[0]() ?? SelectConst.EMPTY_QUERY);

    const getIsFiltering = createMemo(() => getQuery() !== SelectConst.EMPTY_QUERY);

    const getSpreadPadding = createMemo(() =>
        TextFieldUtils.resolvePadding(access(props.padding) ?? SELECT_DEFAULTS.padding),
    );

    const getTextInset = createMemo(() => CSSUtils.spreadableToStyle(getSpreadPadding(), StringUtils.camelToKebabCase));

    const open = () => {
        if (getIsDisabled()) return;

        setIsOpen(true);
    };
    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    const close = () => {
        setIsOpen(false);
    };

    createEffect(() => {
        if (getIsOpen()) return;

        setIsEditing(false);
    });

    const getValueText = () => {
        if (getIsMultiple()) return SelectConst.EMPTY_QUERY;

        const picked = access(props.selectedOptions)[0];

        return picked === undefined ? undefined : props.computeCustomText?.(picked);
    };

    const cursor = ListboxSolidUtils.createCursor<T>({
        focusModel: "active_descendant",
        getListboxId: () => listboxId,
        getOptions: () => access(props.options),
        getSelectedOptions: () => access(props.selectedOptions),
        getIsDisabled,
        getIsMultiple,
        getIsOpen,
        getIsFilterable,
        getIsFiltering,
        getHasMoreOptions: () => access(props.hasMoreOptions) ?? false,
        computeCustomText: props.computeCustomText,
        onOpen: open,
        onClose: close,
        onPick: (value) => props.onPick(value),
    });

    const getFormValues = () => {
        const texts = FormValueUtils.computeTexts(
            access(props.selectedOptions).map((option) => option.value),
            props.computeFormValue,
        );

        return getIsMultiple() || texts.length > 0 ? texts : [EMPTY_FORM_VALUE];
    };

    const clearValue = () => {
        if (getIsDisabled()) return;

        close();

        props.onClear();

        getFieldRef()?.focus();
    };

    FormFieldSolidUtils.registerControl(getFieldRef);

    createEffect(() => {
        if (!SelectUtils.getIsQueryClearDue(getIsOpen(), getHasPopoverSettled(), getQuery())) return;

        props.query?.[1](SelectConst.EMPTY_QUERY);
    });

    const renderOptions = () => (
        <ListboxOptions
            cursor={cursor}
            isLive={getIsOpen}
            hasMoreOptions={props.hasMoreOptions}
            computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
            computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
            computeIsSelected={props.computeIsSelected}
            renderOption={props.renderOption}
            renderGroupHeader={props.renderGroupHeader}
            renderGroupBox={props.renderGroupBox}
            floaterTransitionDurationMs={() =>
                access(props.floaterTransitionDurationMs) ?? SELECT_DEFAULTS.floaterTransitionDurationMs
            }
            renderSelectionFloater={props.renderSelectionFloater}
            renderHighlightFloater={props.renderHighlightFloater}
            onReachEnd={props.onReachEnd}
        />
    );

    return (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({
                isOpen: getIsOpen(),
                isEmpty: access(props.selectedOptions).length < 1,
                isFiltering: getIsFiltering(),
            })}
            ref={(element) => {
                setFieldRef(element);
                props.ref?.(element);
            }}
            renderControl={(setElementRef, getFlags) => (
                <>
                    <SelectField
                        ref={setElementRef}
                        id={getFieldId}
                        ariaLabel={props.ariaLabel}
                        isRequired={props.isRequired}
                        listboxId={() => listboxId}
                        activeOptionId={cursor.getActiveOptionId}
                        isFilterable={getIsFilterable}
                        query={getQuery}
                        isEditing={getIsEditing}
                        valueText={getValueText}
                        textInset={getTextInset}
                        flags={getFlags}
                        computeTextStyle={props.computeTextStyle}
                        renderContent={(getFieldFlags) =>
                            props.renderContent(() => access(props.selectedOptions), getFieldFlags)
                        }
                        onToggle={() => (getIsOpen() && !getIsFilterable() ? close() : open())}
                        onKeyDown={cursor.handleKeyDown}
                        onQueryInput={(query) =>
                            batch(() => {
                                setIsEditing(true);
                                open();
                                cursor.highlight(undefined);

                                props.query?.[1](query);
                            })
                        }
                    />

                    <Show when={props.renderClear && access(props.selectedOptions).length > 0}>
                        <div
                            class={styles.selectClear}
                            style={{ "inset-inline-end": `${getSpreadPadding().paddingInlineEnd}px` }}
                        >
                            <Button
                                isDisabled={getIsDisabled}
                                ariaLabel={props.clearAriaLabel}
                                renderContent={(getClearFlags) => props.renderClear?.(getClearFlags)}
                                onClick={clearValue}
                            />
                        </div>
                    </Show>

                    <FormValue name={props.name} values={getFormValues} />

                    <Popover
                        id={() => listboxId}
                        role={"listbox"}
                        ariaAttributes={() =>
                            SelectUtils.computeListAriaAttributes({
                                listAriaLabel: getListAriaLabel(),
                                labelId: getCaptionId() ?? labelContext.getLabelId(),
                                fieldId: getFieldId(),
                                isMultiple: getIsMultiple(),
                            })
                        }
                        placement={props.placement}
                        offset={props.offset}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        hasAnchorMinWidth={true}
                        isOpen={getIsOpen}
                        anchorRef={getFieldRef}
                        onDismiss={close}
                        onTransitionStatusChange={setHasPopoverSettled}
                        renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) =>
                            props.renderPopup(
                                renderOptions,
                                getVisibilityTarget,
                                getTransitionDurationMs,
                                getPlacement,
                                getFlags,
                            )
                        }
                    />
                </>
            )}
        />
    );
};

export const Select = <T,>(props: SelectProps<T>) => {
    const valueSignal = accessSignal(() => props.value);

    const getSelectedOptions = createMemo(() => {
        const selectedValue = valueSignal[0]();
        const selectedOption = SelectUtils.getFlatOptions(access(props.options)).find(
            (option) => option.value === selectedValue,
        );

        return selectedOption ? [selectedOption] : SelectConst.EMPTY_SELECTION;
    });

    return (
        <SelectComposite
            {...props}
            selectedOptions={getSelectedOptions}
            computeIsSelected={(value) => value === valueSignal[0]()}
            renderContent={(getSelectedOptions, getFlags) =>
                props.renderContent(() => getSelectedOptions()[0], getFlags)
            }
            onPick={(value) => {
                if (value === valueSignal[0]()) return;

                valueSignal[1](() => value);

                void props.onSelectionChange?.(value);
            }}
            onClear={() => {
                if (valueSignal[0]() === undefined) return;

                valueSignal[1](() => undefined);

                void props.onSelectionChange?.(undefined);
            }}
        />
    );
};
