import type { JSX } from "solid-js";
import { Show, createEffect, createMemo, createSignal, createUniqueId } from "solid-js";

import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access, accessSignal } from "../../../Utils/propUtils";
import { Button } from "../../Button/Button";
import { FormFieldUtils } from "../FormField/FormField.utils";
import { useLabelContext } from "../Label/Label.context";
import { LabelUtils } from "../Label/Label.utils";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxUtils } from "../Listbox/Listbox.utils";
import { SELECT_DEFAULTS } from "./Select.const";
import type { SelectCompositeProps, SelectFieldProps, SelectProps } from "./Select.types";
import { SelectUtils } from "./Select.utils";

import * as styles from "./Select.css";

const EMPTY_QUERY = "";
const EMPTY_SELECTION: never[] = [];

const SelectField = (props: SelectFieldProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<HTMLInputElement>();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncUtils.createValueSync(
        getElementRef,
        () => access(props.query),
        { onInput: props.onQueryInput },
    );

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "role": "combobox",
        "aria-haspopup": "listbox",
        get "aria-describedby"() {
            return getAriaDescribedBy();
        },
        get "aria-label"() {
            return getAriaLabel();
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
        get "aria-expanded"() {
            return access(props.flags).isOpen;
        },
        get "aria-controls"() {
            return access(props.flags).isOpen ? access(props.listboxId) : undefined;
        },
        get "aria-activedescendant"() {
            return access(props.activeOptionId);
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
                    onClick={() => {
                        if (getIsDisabled()) return;

                        props.onToggle();
                    }}
                >
                    {props.renderContent(() => access(props.flags))}
                </button>
            }
        >
            {props.renderContent(() => access(props.flags))}

            <input
                id={access(props.id)}
                ref={(element) => {
                    setElementRef(element);
                    props.ref?.(element);
                }}
                type="text"
                class={styles.selectFilterField}
                style={{ ...access(props.textInset), ...props.computeTextStyle?.(() => access(props.flags)) }}
                autocomplete="off"
                readOnly={getIsDisabled()}
                aria-autocomplete="list"
                {...commonProps}
                onClick={() => {
                    if (getIsDisabled()) return;

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

    const getFieldId = () => access(props.id) ?? fallbackFieldId;

    const getListAriaLabel = () => access(props.listAriaLabel);

    const [getFieldRef, setFieldRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorUtils.createOptional(() => props.visibilitySignal, false);
    const [getHasPopoverSettled, setHasPopoverSettled] = createSignal(true);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsMultiple = createMemo(() => access(props.isMultiple) ?? false);

    const getIsFilterable = createMemo(() => props.querySignal !== undefined);

    const getQuery = createMemo(() => props.querySignal?.[0]() ?? EMPTY_QUERY);

    const getIsFiltering = createMemo(() => getQuery() !== EMPTY_QUERY);

    const getSpreadPadding = createMemo(() => {
        const padding = access(props.padding) ?? SELECT_DEFAULTS.padding;

        return typeof padding === "number" ? CSSUtils.spreadPadding(padding) : padding;
    });

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

    const cursor = ListboxUtils.createCursor<T>({
        focusModel: "activeDescendant",
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

    const clearValue = () => {
        if (getIsDisabled()) return;

        close();

        props.onClear();

        getFieldRef()?.focus();
    };

    FormFieldUtils.registerControl(getFieldRef);

    createEffect(() => {
        if (getIsOpen() || !getHasPopoverSettled() || getQuery() === EMPTY_QUERY) return;

        props.querySignal?.[1](EMPTY_QUERY);
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
            renderGroup={props.renderGroup}
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
                        textInset={getTextInset}
                        flags={getFlags}
                        computeTextStyle={props.computeTextStyle}
                        renderContent={(getFieldFlags) =>
                            props.renderContent(() => access(props.selectedOptions), getFieldFlags)
                        }
                        onToggle={() => (getIsOpen() && !getIsFilterable() ? close() : open())}
                        onKeyDown={cursor.handleKeyDown}
                        onQueryInput={(query) => {
                            open();
                            cursor.highlight(undefined);

                            props.querySignal?.[1](query);
                        }}
                    />

                    <Show when={props.renderClear && access(props.selectedOptions).length > 0}>
                        <div class={styles.selectClear} style={{ right: `${getSpreadPadding().paddingRight}px` }}>
                            <Button
                                isDisabled={getIsDisabled}
                                ariaLabel={props.clearAriaLabel}
                                renderContent={(getClearFlags) => props.renderClear?.(getClearFlags)}
                                onClick={clearValue}
                            />
                        </div>
                    </Show>

                    <Popover
                        id={() => listboxId}
                        role={"listbox"}
                        ariaAttributes={() => ({
                            "aria-label": getListAriaLabel(),
                            "aria-labelledby":
                                getListAriaLabel() === undefined
                                    ? (labelContext.getLabelId() ?? getFieldId())
                                    : undefined,
                            "aria-multiselectable": getIsMultiple() || undefined,
                        })}
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
    const valueSignal = accessSignal(() => props.valueSignal);

    const getSelectedOptions = createMemo(() => {
        const selectedValue = valueSignal[0]();
        const selectedOption = SelectUtils.getFlatOptions(access(props.options)).find(
            (option) => option.value === selectedValue,
        );

        return selectedOption ? [selectedOption] : EMPTY_SELECTION;
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
