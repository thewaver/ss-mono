import { Fragment, type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
    LISTBOX_DEFAULTS,
    ListboxStyles,
    ListboxUtils,
    type SelectOptionFlags,
    SelectUtils,
    type VirtualizerRow,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { VirtualizerReactUtils } from "../../../Abstracts/Virtualizer/VirtualizerReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../../Utils/refUtils";
import type { SelectItem, SelectOption, SelectOptionGroup } from "../Select/Select.types";
import type { ListboxCompositeProps, ListboxOptionItemProps, ListboxOptionsProps, ListboxProps } from "./Listbox.types";
import { ListboxReactUtils } from "./ListboxReact.utils";

const EMPTY_SELECTION: never[] = [];

const ListboxOptionItem = (props: ListboxOptionItemProps) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const latestRef = useLatest(props.ref);

    const isDisabled = props.flags.isDisabled ?? false;
    const isHighlighted = props.flags.isHighlighted ?? false;

    useEffect(() => {
        if (!isHighlighted || !props.isSelfScrolling) return;

        elementRef.current?.scrollIntoView({ block: "nearest" });
    }, [isHighlighted, props.isSelfScrolling]);

    const setRef = useCallback(
        (element: HTMLDivElement | null) => {
            elementRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    return (
        <div
            id={props.id}
            ref={setRef}
            className={ListboxStyles.listboxOption}
            role="option"
            aria-disabled={isDisabled || undefined}
            aria-selected={props.flags.isSelected}
            onFocus={(e) => {
                if (e.target !== e.currentTarget) return;

                props.onFocus?.();
            }}
            onClick={() => {
                if (isDisabled) return;

                props.onSelect();
            }}
        >
            {props.renderContent(props.flags)}
        </div>
    );
};

const useGeneration = (value: unknown) => {
    const ref = useRef({ value, generation: 0 });

    if (ref.current.value !== value) ref.current = { value, generation: ref.current.generation + 1 };

    return ref.current.generation;
};

export const ListboxOptions = <T,>(props: ListboxOptionsProps<T>) => {
    const cursor = props.cursor;
    const isRoving = cursor.focusModel === "roving";

    const endMarkerRef = useRef<HTMLDivElement | null>(null);
    const sizerRef = useRef<HTMLDivElement | null>(null);
    const latest = useLatest(props);

    const isLive = props.isLive;
    const isListDisabled = props.isDisabled ?? false;
    const hasMoreOptions = props.hasMoreOptions ?? false;
    const isHorizontal = cursor.orientation === "horizontal";
    const isVirtualized = props.computeEstimatedOptionHeight !== undefined && !isHorizontal;
    const rows = cursor.rows;

    const isAtEnd = ElementObserverReactUtils.useViewportIntersection(endMarkerRef, !isLive);
    const optionsGeneration = useGeneration(cursor.options);

    const [reachEndGuard] = useState(() => ListboxUtils.createReachEndGuard<SelectItem<T>[]>());

    useEffect(() => {
        if (!isAtEnd || !hasMoreOptions) return;

        if (!reachEndGuard.claim(latest.current.cursor.options)) return;

        latest.current.onReachEnd?.();
    }, [isAtEnd, hasMoreOptions, reachEndGuard, latest]);

    useEffect(() => {
        if (isLive) return;

        reachEndGuard.reset();
    }, [isLive, reachEndGuard]);

    const rowWindow = VirtualizerReactUtils.useRowWindow(sizerRef, rows.length, {
        isDisabled: !isVirtualized || !isLive,
        computeEstimatedSize: (index) =>
            ListboxUtils.computeEstimatedRowSize(
                rows[index],
                props.computeEstimatedOptionHeight,
                props.computeEstimatedGroupHeight,
            ),
        pinnedRows: ListboxUtils.getPinnedRows(rows, cursor.highlightedIndex),
    });

    const highlightedRowIndex = ListboxUtils.getHighlightedRowIndex(rows, cursor.highlightedIndex);
    const latestRowWindow = useLatest(rowWindow);

    useEffect(() => {
        if (!rowWindow.isLive || highlightedRowIndex === undefined) return;

        latestRowWindow.current.scrollToRow(highlightedRowIndex);
    }, [rowWindow.isLive, highlightedRowIndex, rows, latestRowWindow]);

    const renderGroupHeading = (group: SelectOptionGroup<T>) =>
        props.renderGroup?.(group, ListboxUtils.computeGroupFlags(group, props.computeIsSelected));

    const renderOptionSlot = (option: SelectOption<T>, flatIndex: number, key: string | number) => (
        <InteractionWrapper<SelectOptionFlags>
            key={key}
            sizing={isHorizontal ? "fit-content" : "fill"}
            isDisabled={(option.isDisabled ?? false) || isListDisabled}
            isReachableWhenDisabled={option.isReachableWhenDisabled ?? false}
            isFocusableWhenDisabled={isRoving && !isListDisabled && (option.isReachableWhenDisabled ?? false)}
            isTabbable={isRoving && flatIndex === cursor.highlightedIndex}
            tooltipDefs={option.tooltipDefs}
            extraFlags={{
                isHighlighted: cursor.isHighlightShown && flatIndex === cursor.highlightedIndex,
                isSelected: props.computeIsSelected(option.value),
            }}
            renderControl={(setElementRef, flags) => (
                <ListboxOptionItem
                    ref={setElementRef}
                    id={cursor.getOptionId(flatIndex)}
                    isSelfScrolling={!isVirtualized}
                    flags={flags}
                    renderContent={(optionFlags) => props.renderOption(option, optionFlags)}
                    onFocus={isRoving ? () => cursor.highlight(option.value) : undefined}
                    onSelect={() => cursor.pick(option.value)}
                />
            )}
        />
    );

    const renderMountedOptions = () =>
        cursor.options.map((item, index) => {
            const offset = cursor.itemRows[index].entryOffset;

            if (!SelectUtils.getIsGroup(item)) return renderOptionSlot(item, offset, index);

            return (
                <div key={index} role="group" aria-label={item.label}>
                    {renderGroupHeading(item)}

                    {item.options.map((option, groupIndex) =>
                        renderOptionSlot(option, offset + groupIndex, groupIndex),
                    )}
                </div>
            );
        });

    const renderWindowedRow = (row: VirtualizerRow): ReactNode => {
        const source = rows[row.index];

        return (
            <div
                key={row.index}
                ref={rowWindow.measureRow(row.index)}
                className={ListboxStyles.listboxSizerRow}
                style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
            >
                {source.isEntry
                    ? renderOptionSlot(source.node as SelectOption<T>, source.entryOffset, row.index)
                    : renderGroupHeading(source.node as SelectOptionGroup<T>)}
            </div>
        );
    };

    const renderWindowedOptions = () => (
        <div ref={sizerRef} className={ListboxStyles.listboxSizer} style={{ height: `${rowWindow.totalSize}px` }}>
            {ListboxUtils.getWindowedRuns(rowWindow.rows, rows).map((run) =>
                run.group ? (
                    <div key={`group-${run.groupIndex}`} role="group" aria-label={run.group.label}>
                        {run.rows.map(renderWindowedRow)}
                    </div>
                ) : (
                    <Fragment key={`rows-${run.rows[0].index}`}>{run.rows.map(renderWindowedRow)}</Fragment>
                ),
            )}
        </div>
    );

    return (
        <>
            {isVirtualized ? renderWindowedOptions() : renderMountedOptions()}

            {hasMoreOptions && (
                <div
                    key={optionsGeneration}
                    ref={endMarkerRef}
                    className={ListboxStyles.listboxEndMarker}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export const ListboxComposite = <T,>(props: ListboxCompositeProps<T>) => {
    const fallbackId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const orientation = props.orientation ?? LISTBOX_DEFAULTS.orientation;
    const isDisabled = props.isDisabled ?? false;
    const isMultiple = props.isMultiple ?? false;
    const listboxId = props.id ?? fallbackId;

    const cursor = ListboxReactUtils.useCursor<T>({
        focusModel: "roving",
        listboxId,
        options: props.options,
        selectedOptions: props.selectedOptions,
        isDisabled,
        isMultiple,
        hasMoreOptions: props.hasMoreOptions ?? false,
        orientation,
        direction,
        computeCustomText: props.computeCustomText,
        onPick: props.onPick,
    });

    return (
        <div
            ref={rootRef}
            id={listboxId}
            className={orientation === "horizontal" ? ListboxStyles.listboxHorizontal : undefined}
            role="listbox"
            aria-label={props.ariaLabel}
            aria-multiselectable={isMultiple || undefined}
            aria-orientation={orientation}
            aria-disabled={isDisabled || undefined}
            onKeyDown={(e) => cursor.handleKeyDown(e.nativeEvent)}
            onFocus={() => cursor.setHasFocus(true)}
            onBlur={(e) => {
                const next = e.relatedTarget;

                cursor.setHasFocus(next instanceof Node && (rootRef.current?.contains(next) ?? false));
            }}
        >
            <ListboxOptions
                cursor={cursor}
                isLive={true}
                isDisabled={isDisabled}
                hasMoreOptions={props.hasMoreOptions}
                computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                computeIsSelected={props.computeIsSelected}
                renderOption={props.renderOption}
                renderGroup={props.renderGroup}
                onReachEnd={props.onReachEnd}
            />
        </div>
    );
};

export const Listbox = <T,>(props: ListboxProps<T>) => {
    const [value, setValue] = props.valueState;

    const selectedOptions = useMemo(() => {
        const selectedOption = SelectUtils.getFlatOptions(props.options).find((option) => option.value === value);

        return selectedOption ? [selectedOption] : EMPTY_SELECTION;
    }, [props.options, value]);

    return (
        <ListboxComposite
            {...props}
            selectedOptions={selectedOptions}
            computeIsSelected={(candidate) => candidate === value}
            onPick={(picked) => {
                if (picked === value) return;

                setValue(picked);

                props.onSelectionChange?.(picked);
            }}
        />
    );
};
