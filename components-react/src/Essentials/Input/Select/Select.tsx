import { type CSSProperties, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
    ListboxUtils,
    SELECT_DEFAULTS,
    type SelectFlags,
    SelectStyles,
    SelectUtils,
    TextFieldUtils,
} from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { TextSyncReactUtils } from "../../../Abstracts/TextSync/TextSyncReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { useLatest } from "../../../Utils/refUtils";
import { Button } from "../../Button/Button";
import { FormFieldReactUtils } from "../FormField/FormFieldReact.utils";
import { useLabelContext } from "../Label/Label.context";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxReactUtils } from "../Listbox/ListboxReact.utils";
import type { SelectCompositeProps, SelectFieldProps, SelectProps } from "./Select.types";

const EMPTY_QUERY = "";
const EMPTY_SELECTION: never[] = [];

const SelectField = (props: SelectFieldProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const latestRef = useLatest(props.ref);

    const isDisabled = props.flags.isDisabled ?? false;

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncReactUtils.useValueSync(
        inputRef,
        props.query,
        { onInput: (query) => props.onQueryInput(query) },
    );

    const setInputRef = useCallback(
        (element: HTMLInputElement | null) => {
            inputRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const commonProps = {
        "aria-describedby": ariaDescribedBy,
        "aria-label": ariaLabel,
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
                ref={props.ref}
                type="button"
                className={SelectStyles.selectField}
                {...commonProps}
                onKeyDown={(e) => props.onKeyDown(e.nativeEvent)}
                onClick={handleClick}
            >
                {props.renderContent(props.flags)}
            </button>
        );
    }

    return (
        <>
            {props.renderContent(props.flags)}

            <input
                id={props.id}
                ref={setInputRef}
                type="text"
                className={SelectStyles.selectFilterField}
                style={{ ...props.textInset, ...props.computeTextStyle?.(props.flags) }}
                autoComplete="off"
                readOnly={isDisabled}
                {...commonProps}
                onKeyDown={(e) => props.onKeyDown(e.nativeEvent)}
                onClick={handleClick}
                onInput={(e) => handleInput(e.currentTarget)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget)}
            />
        </>
    );
};

export const SelectComposite = <T,>(props: SelectCompositeProps<T>) => {
    const listboxId = useId();
    const fallbackFieldId = useId();

    const labelContext = useLabelContext();

    const fieldRef = useRef<HTMLElement | null>(null);
    const latestRef = useLatest(props.ref);
    const [fieldElement, setFieldElement] = useState<HTMLElement>();

    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibilityState, false);
    const [hasPopoverSettled, setHasPopoverSettled] = useState(true);
    const [wasOpen, setWasOpen] = useState(isOpen);

    const fieldId = props.id ?? fallbackFieldId;
    const isDisabled = props.isDisabled ?? false;
    const isMultiple = props.isMultiple ?? false;
    const isFilterable = props.queryState !== undefined;
    const query = props.queryState?.[0] ?? EMPTY_QUERY;
    const isFiltering = query !== EMPTY_QUERY;

    if (wasOpen !== isOpen) {
        setWasOpen(isOpen);

        if (!isOpen) setHasPopoverSettled(false);
    }

    const spreadPadding = TextFieldUtils.resolvePadding(props.padding ?? SELECT_DEFAULTS.padding);
    const textInset = CSSUtils.spreadableToStyle(spreadPadding, String) as CSSProperties;

    const open = () => {
        if (isDisabled) return;

        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen || !isDisabled) return;

        setIsOpen(false);
    }, [isOpen, isDisabled, setIsOpen]);

    const cursor = ListboxReactUtils.useCursor<T>({
        focusModel: "activeDescendant",
        listboxId,
        options: props.options,
        selectedOptions: props.selectedOptions,
        isDisabled,
        isMultiple,
        isOpen,
        isFilterable,
        isFiltering,
        hasMoreOptions: props.hasMoreOptions ?? false,
        computeCustomText: props.computeCustomText,
        onOpen: open,
        onClose: close,
        onPick: props.onPick,
    });

    const clearValue = () => {
        if (isDisabled) return;

        close();

        props.onClear();

        fieldRef.current?.focus();
    };

    FormFieldReactUtils.useRegisterControl(fieldRef);

    const latestQueryState = useLatest(props.queryState);

    useEffect(() => {
        if (!SelectUtils.getIsQueryClearDue(isOpen, hasPopoverSettled, query)) return;

        latestQueryState.current?.[1](EMPTY_QUERY);
    }, [isOpen, hasPopoverSettled, query, latestQueryState]);

    const setFieldRef = useCallback(
        (element: HTMLElement | null) => {
            fieldRef.current = element;
            setFieldElement(element ?? undefined);
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const renderOptions = () => (
        <ListboxOptions
            cursor={cursor}
            isLive={isOpen}
            hasMoreOptions={props.hasMoreOptions}
            computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
            computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
            computeIsSelected={props.computeIsSelected}
            renderOption={props.renderOption}
            renderGroup={props.renderGroup}
            onReachEnd={props.onReachEnd}
        />
    );

    const extraFlags: SelectFlags = {
        isOpen,
        isEmpty: props.selectedOptions.length < 1,
        isFiltering,
    };

    return (
        <InteractionWrapper<SelectFlags>
            {...props}
            extraFlags={extraFlags}
            ref={setFieldRef}
            renderControl={(setElementRef, flags) => (
                <>
                    <SelectField
                        ref={setElementRef}
                        id={fieldId}
                        ariaLabel={props.ariaLabel}
                        isRequired={props.isRequired}
                        listboxId={listboxId}
                        activeOptionId={cursor.activeOptionId}
                        isFilterable={isFilterable}
                        query={query}
                        textInset={textInset}
                        flags={flags}
                        computeTextStyle={props.computeTextStyle}
                        renderContent={(fieldFlags) => props.renderContent(props.selectedOptions, fieldFlags)}
                        onToggle={() => (isOpen && !isFilterable ? close() : open())}
                        onKeyDown={cursor.handleKeyDown}
                        onQueryInput={(next) => {
                            open();
                            cursor.highlight(undefined);

                            props.queryState?.[1](next);
                        }}
                    />

                    {props.renderClear && props.selectedOptions.length > 0 && (
                        <div className={SelectStyles.selectClear} style={{ right: `${spreadPadding.paddingRight}px` }}>
                            <Button
                                isDisabled={isDisabled}
                                ariaLabel={props.clearAriaLabel}
                                renderContent={(clearFlags) => props.renderClear?.(clearFlags)}
                                onClick={clearValue}
                            />
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
                        isOpen={isOpen}
                        anchorRef={fieldElement}
                        onDismiss={close}
                        onTransitionStatusChange={setHasPopoverSettled}
                        renderContent={(visibilityTarget, transitionDurationMs, placement) =>
                            props.renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement, flags)
                        }
                    />
                </>
            )}
        />
    );
};

export const Select = <T,>(props: SelectProps<T>) => {
    const [value, setValue] = props.valueState;

    const selectedOptions = useMemo(() => {
        const selectedOption = SelectUtils.getFlatOptions(props.options).find((option) => option.value === value);

        return selectedOption ? [selectedOption] : EMPTY_SELECTION;
    }, [props.options, value]);

    return (
        <SelectComposite
            {...props}
            selectedOptions={selectedOptions}
            computeIsSelected={(candidate) => candidate === value}
            renderContent={(selected, flags) => props.renderContent(selected[0], flags)}
            onPick={(picked) => {
                if (picked === value) return;

                setValue(picked);

                props.onSelectionChange?.(picked);
            }}
            onClear={() => {
                if (value === undefined) return;

                setValue(undefined);

                props.onSelectionChange?.(undefined);
            }}
        />
    );
};
