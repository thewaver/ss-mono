import type { Accessor } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import { CheckedStateUtils } from "../../../Abstracts/CheckedState/CheckedState.utils";
import { ElementObserverUtils } from "../../../Abstracts/ElementObserver/ElementObserver.utils";
import { FlattenerUtils } from "../../../Abstracts/Flattener/Flattener.utils";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { VirtualizerRow } from "../../../Abstracts/Virtualizer/Virtualizer.types";
import { VirtualizerUtils } from "../../../Abstracts/Virtualizer/Virtualizer.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { SelectGroupFlags, SelectItem, SelectOption, SelectOptionGroup } from "../Select/Select.types";
import { SelectUtils } from "../Select/Select.utils";
import { LISTBOX_DEFAULTS } from "./Listbox.const";
import type { ListboxCompositeProps, ListboxOptionItemProps, ListboxOptionsProps, ListboxProps } from "./Listbox.types";
import { ListboxUtils } from "./Listbox.utils";

import * as styles from "./Listbox.css";

const EMPTY_SELECTION: never[] = [];

const ListboxOptionItem = (props: ListboxOptionItemProps) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsHighlighted = createMemo(() => access(props.flags).isHighlighted ?? false);

    createEffect(() => {
        if (!getIsHighlighted() || !access(props.isSelfScrolling)) return;

        getElementRef()?.scrollIntoView({ block: "nearest" });
    });

    return (
        <div
            id={access(props.id)}
            ref={(element) => {
                setElementRef(element);
                props.ref?.(element);
            }}
            class={styles.listboxOption}
            role="option"
            aria-disabled={getIsDisabled() || undefined}
            aria-selected={access(props.flags).isSelected}
            onFocus={() => props.onFocus?.()}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onSelect();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

export const ListboxOptions = <T,>(props: ListboxOptionsProps<T>) => {
    const cursor = props.cursor;
    const isRoving = cursor.focusModel === "roving";

    const [getEndMarkerRef, setEndMarkerRef] = createSignal<HTMLElement>();
    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const getIsLive = createMemo(() => access(props.isLive));

    const getIsListDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getHasMoreOptions = createMemo(() => access(props.hasMoreOptions) ?? false);

    const getIsHorizontal = createMemo(() => cursor.getOrientation() === "horizontal");

    const getIsVirtualized = createMemo(() => props.computeEstimatedOptionHeight !== undefined && !getIsHorizontal());

    const getIsAtEnd = ElementObserverUtils.createViewportIntersectionObserver(getEndMarkerRef, () => !getIsLive());

    let askedForOptions: SelectItem<T>[] | undefined;

    createEffect(() => {
        if (!getIsAtEnd() || !getHasMoreOptions()) return;

        const options = untrack(cursor.getOptions);

        if (askedForOptions === options) return;

        askedForOptions = options;

        props.onReachEnd?.();
    });

    createEffect(() => {
        if (getIsLive()) return;

        askedForOptions = undefined;
    });

    const rowWindow = VirtualizerUtils.createRowWindow(getSizerRef, () => cursor.getRows().length, {
        getIsDisabled: () => !getIsVirtualized() || !getIsLive(),
        computeEstimatedSize: (index) => {
            const row = cursor.getRows()[index];

            return row?.isEntry !== true
                ? (props.computeEstimatedGroupHeight?.(row?.position ?? 0) ??
                      props.computeEstimatedOptionHeight?.(0) ??
                      0)
                : (props.computeEstimatedOptionHeight?.(row.entryOffset) ?? 0);
        },
        getPinnedRows: () => {
            const highlightedIndex = cursor.getHighlightedIndex();

            if (highlightedIndex === undefined) return EMPTY_SELECTION;

            const rowIndex = FlattenerUtils.getEntryRowIndex(cursor.getRows(), highlightedIndex);

            return rowIndex === -1 ? EMPTY_SELECTION : [rowIndex];
        },
    });

    createEffect(() => {
        if (!rowWindow.getIsLive()) return;

        const highlightedIndex = cursor.getHighlightedIndex();

        if (highlightedIndex === undefined) return;

        const rowIndex = FlattenerUtils.getEntryRowIndex(cursor.getRows(), highlightedIndex);

        if (rowIndex === -1) return;

        rowWindow.scrollToRow(rowIndex);
    });

    const computeGroupFlags = (group: SelectOptionGroup<T>): SelectGroupFlags => ({
        checkedState: CheckedStateUtils.fromMembers(
            group.options.map((option) => props.computeIsSelected(option.value)),
        ),
    });

    const renderOptionSlot = (getOption: Accessor<SelectOption<T>>, getFlatIndex: Accessor<number>) => (
        <InteractionWrapper
            sizing={() => (getIsHorizontal() ? "fit-content" : "fill")}
            isDisabled={() => (getOption().isDisabled ?? false) || getIsListDisabled()}
            isReachableWhenDisabled={() => getOption().isReachableWhenDisabled ?? false}
            isFocusableWhenDisabled={() =>
                isRoving && !getIsListDisabled() && (getOption().isReachableWhenDisabled ?? false)
            }
            isTabbable={() => isRoving && getFlatIndex() === cursor.getHighlightedIndex()}
            tooltipDefs={() => getOption().tooltipDefs}
            extraFlags={() => ({
                isHighlighted: cursor.getIsHighlightShown() && getFlatIndex() === cursor.getHighlightedIndex(),
                isSelected: props.computeIsSelected(getOption().value),
            })}
            renderControl={(setElementRef, getFlags) => (
                <ListboxOptionItem
                    ref={setElementRef}
                    id={() => cursor.getOptionId(getFlatIndex())}
                    isSelfScrolling={() => !getIsVirtualized()}
                    flags={getFlags}
                    renderContent={(getOptionFlags) => props.renderOption(getOption, getOptionFlags)}
                    onFocus={isRoving ? () => cursor.highlight(getOption().value) : undefined}
                    onSelect={() => cursor.pick(getOption().value)}
                />
            )}
        />
    );

    const renderMountedOptions = () => (
        <Index each={cursor.getOptions()}>
            {(getItem, index) => (
                <Show
                    when={SelectUtils.getIsGroup(getItem())}
                    fallback={renderOptionSlot(
                        () => getItem() as SelectOption<T>,
                        () => cursor.getItemRows()[index].entryOffset,
                    )}
                >
                    <div role="group" aria-label={(getItem() as SelectOptionGroup<T>).label}>
                        {props.renderGroup?.(
                            () => getItem() as SelectOptionGroup<T>,
                            () => computeGroupFlags(getItem() as SelectOptionGroup<T>),
                        )}

                        <Index each={(getItem() as SelectOptionGroup<T>).options}>
                            {(getOption, groupIndex) =>
                                renderOptionSlot(getOption, () => cursor.getItemRows()[index].entryOffset + groupIndex)
                            }
                        </Index>
                    </div>
                </Show>
            )}
        </Index>
    );

    const renderWindowedRow = (row: VirtualizerRow) => {
        const getRow = () => cursor.getRows()[row.index];

        return (
            <div
                class={styles.listboxSizerRow}
                style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                ref={(element) => rowWindow.measureRow(element, row.index)}
            >
                <Show
                    when={getRow().isEntry}
                    fallback={props.renderGroup?.(
                        () => getRow().node as SelectOptionGroup<T>,
                        () => computeGroupFlags(getRow().node as SelectOptionGroup<T>),
                    )}
                >
                    {renderOptionSlot(
                        () => getRow().node as SelectOption<T>,
                        () => getRow().entryOffset,
                    )}
                </Show>
            </div>
        );
    };

    const getWindowedRuns = createMemo(() => {
        const runs: {
            groupIndex: number | undefined;
            group: SelectOptionGroup<T> | undefined;
            rows: VirtualizerRow[];
        }[] = [];

        for (const row of rowWindow.getRows()) {
            const source = cursor.getRows()[row.index];
            const groupIndex = source === undefined ? undefined : SelectUtils.getGroupRowIndex(source);
            const last = runs[runs.length - 1];

            if (last && last.groupIndex === groupIndex) {
                last.rows.push(row);

                continue;
            }

            runs.push({
                groupIndex,
                group:
                    groupIndex === undefined ? undefined : (cursor.getRows()[groupIndex].node as SelectOptionGroup<T>),
                rows: [row],
            });
        }

        return runs;
    });

    const renderWindowedOptions = () => (
        <div ref={setSizerRef} class={styles.listboxSizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
            <For each={getWindowedRuns()}>
                {(run) => (
                    <Show when={run.group} fallback={<For each={run.rows}>{renderWindowedRow}</For>} keyed>
                        {(group: SelectOptionGroup<T>) => (
                            <div role="group" aria-label={group.label}>
                                <For each={run.rows}>{renderWindowedRow}</For>
                            </div>
                        )}
                    </Show>
                )}
            </For>
        </div>
    );

    return (
        <>
            <Show when={getIsVirtualized()} fallback={renderMountedOptions()}>
                {renderWindowedOptions()}
            </Show>

            <Show when={getHasMoreOptions() && cursor.getOptions()} keyed>
                {(_items: SelectItem<T>[]) => (
                    <div ref={setEndMarkerRef} class={styles.listboxEndMarker} aria-hidden="true" />
                )}
            </Show>
        </>
    );
};

export const ListboxComposite = <T,>(props: ListboxCompositeProps<T>) => {
    const fallbackId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const getOrientation = createMemo(() => access(props.orientation) ?? LISTBOX_DEFAULTS.orientation);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsMultiple = createMemo(() => access(props.isMultiple) ?? false);

    const getListboxId = createMemo(() => access(props.id) ?? fallbackId);

    const cursor = ListboxUtils.createCursor<T>({
        focusModel: "roving",
        getListboxId,
        getOptions: () => access(props.options),
        getSelectedOptions: () => access(props.selectedOptions),
        getIsDisabled,
        getIsMultiple,
        getHasMoreOptions: () => access(props.hasMoreOptions) ?? false,
        getOrientation,
        getDirection,
        computeCustomText: props.computeCustomText,
        onPick: (value) => props.onPick(value),
    });

    return (
        <div
            ref={setRootRef}
            id={getListboxId()}
            classList={{ [styles.listboxHorizontal]: getOrientation() === "horizontal" }}
            role="listbox"
            aria-label={access(props.ariaLabel)}
            aria-multiselectable={getIsMultiple() || undefined}
            aria-orientation={getOrientation()}
            aria-disabled={getIsDisabled() || undefined}
            onKeyDown={(e) => cursor.handleKeyDown(e)}
            onFocusIn={() => cursor.setHasFocus(true)}
            onFocusOut={(e) => {
                const next = e.relatedTarget;

                cursor.setHasFocus(next instanceof Node && (getRootRef()?.contains(next) ?? false));
            }}
        >
            <ListboxOptions
                cursor={cursor}
                isLive={true}
                isDisabled={getIsDisabled}
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
    const valueSignal = accessSignal(() => props.valueSignal);

    const getSelectedOptions = createMemo(() => {
        const selectedValue = valueSignal[0]();
        const selectedOption = SelectUtils.getFlatOptions(access(props.options)).find(
            (option) => option.value === selectedValue,
        );

        return selectedOption ? [selectedOption] : EMPTY_SELECTION;
    });

    return (
        <ListboxComposite
            {...props}
            selectedOptions={getSelectedOptions}
            computeIsSelected={(value) => value === valueSignal[0]()}
            onPick={(value) => {
                if (value === valueSignal[0]()) return;

                valueSignal[1](() => value);

                void props.onSelectionChange?.(value);
            }}
        />
    );
};
