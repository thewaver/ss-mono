import type { Accessor } from "solid-js";
import {
    For,
    Index,
    Show,
    createComputed,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
    untrack,
} from "solid-js";

import {
    LISTBOX_DEFAULTS,
    ListboxUtils,
    SelectUtils,
    type VirtualizerRow,
    FloaterStyles as floaterStyles,
    ListboxStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { FloaterSolidUtils } from "../../../Abstracts/Floater/FloaterSolid.utils";
import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { VirtualizerSolidUtils } from "../../../Abstracts/Virtualizer/VirtualizerSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { SelectItem, SelectOption, SelectOptionGroup } from "../Select/SelectSolid.types";
import type {
    ListboxCompositeProps,
    ListboxOptionItemProps,
    ListboxOptionsProps,
    ListboxProps,
} from "./ListboxSolid.types";
import { ListboxSolidUtils } from "./ListboxSolid.utils";

const EMPTY_SELECTION: never[] = [];

const ListboxOptionItem = (props: ListboxOptionItemProps) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsHighlighted = createMemo(() => access(props.flags).isHighlighted ?? false);

    createEffect(() => {
        if (!getIsHighlighted() || !access(props.isSelfScrolling)) return;

        const element = getElementRef();

        if (element) ListboxUtils.revealOption(element, access(props.focusModel));
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
            tabIndex={-1}
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
    const [getOptionsRef, setOptionsRef] = createSignal<HTMLElement>();
    const [getOptionRefs, setOptionRefs] = createSignal<Map<HTMLElement, Accessor<number>>>(new Map(), {
        equals: false,
    });

    const setOptionRef = (element: HTMLElement, getFlatIndex: Accessor<number>) =>
        setOptionRefs((refs) => refs.set(element, getFlatIndex));

    const dropOptionRef = (element: HTMLElement) =>
        setOptionRefs((refs) => {
            refs.delete(element);

            return refs;
        });

    const findOptionRef = (index: number) =>
        [...getOptionRefs()].find(([, getFlatIndex]) => getFlatIndex() === index)?.[0];

    const getFloaterTransitionDurationMs = createMemo(
        () => access(props.floaterTransitionDurationMs) ?? LISTBOX_DEFAULTS.floaterTransitionDurationMs,
    );

    const getIsLive = createMemo(() => access(props.isLive));

    const getIsListDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getHasMoreOptions = createMemo(() => access(props.hasMoreOptions) ?? false);

    const getIsHorizontal = createMemo(() => cursor.getOrientation() === "horizontal");

    const getIsVirtualized = createMemo(() => props.computeEstimatedOptionHeight !== undefined && !getIsHorizontal());

    const getIsAtEnd = ElementObserverSolidUtils.createViewportIntersectionObserver(
        getEndMarkerRef,
        () => !getIsLive(),
    );

    const reachEndGuard = ListboxUtils.createReachEndGuard<SelectItem<T>[]>();

    createEffect(() => {
        if (!getIsAtEnd() || !getHasMoreOptions()) return;

        if (!reachEndGuard.claim(untrack(cursor.getOptions))) return;

        props.onReachEnd?.();
    });

    createEffect(() => {
        if (getIsLive()) return;

        reachEndGuard.reset();
    });

    const rowWindow = VirtualizerSolidUtils.createRowWindow(getSizerRef, () => cursor.getRows().length, {
        getIsDisabled: () => !getIsVirtualized() || !getIsLive(),
        computeEstimatedSize: (index) =>
            ListboxUtils.computeEstimatedRowSize(
                cursor.getRows()[index],
                props.computeEstimatedOptionHeight,
                props.computeEstimatedGroupHeight,
            ),
        getPinnedRows: () => ListboxUtils.getPinnedRows(cursor.getRows(), cursor.getHighlightedIndex()),
    });

    createEffect(() => {
        if (!rowWindow.getIsLive()) return;

        const rowIndex = ListboxUtils.getHighlightedRowIndex(cursor.getRows(), cursor.getHighlightedIndex());

        if (rowIndex === undefined) return;

        rowWindow.scrollToRow(rowIndex);
    });

    const getSelectedIndex = createMemo(() => {
        const index = SelectUtils.getFlatOptions(cursor.getOptions()).findIndex((option) =>
            props.computeIsSelected(option.value),
        );

        return index < 0 ? undefined : index;
    });

    const [getHoveredIndex, setHoveredIndex] = createSignal<number>();

    const findOptionIndex = (target: EventTarget | null) =>
        target instanceof Node ? [...getOptionRefs()].find(([element]) => element.contains(target))?.[1]() : undefined;

    const handleOptionsPointerOver = (e: PointerEvent) => setHoveredIndex(findOptionIndex(e.target));

    const handleOptionsPointerLeave = () => setHoveredIndex(undefined);

    const createFloater = (getIsEnabled: () => boolean, getIndex: () => number | undefined) =>
        FloaterSolidUtils.create({
            getIsEnabled,
            getContainer: () => (getIsVirtualized() ? getSizerRef() : getOptionsRef()),
            getTarget: () => {
                const index = getIndex();
                return index === undefined ? undefined : findOptionRef(index);
            },
            getTransitionDurationMs: getFloaterTransitionDurationMs,
        });

    const selectionFloater = createFloater(() => props.renderSelectionFloater !== undefined, getSelectedIndex);

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => getHoveredIndex() ?? (cursor.getIsHighlightShown() ? cursor.getHighlightedIndex() : undefined),
    );

    const renderFloater = (
        floater: ReturnType<typeof createFloater>,
        renderContent: ListboxOptionsProps<T>["renderSelectionFloater"],
    ) => (
        <Show when={floater.getIsRendered()}>
            <div
                ref={floater.setRef}
                class={floaterStyles.floater}
                style={{ ...floater.getBounds(), "transition-duration": `${getFloaterTransitionDurationMs()}ms` }}
            >
                {renderContent?.(floater.getVisibilityTarget, getFloaterTransitionDurationMs)}
            </div>
        </Show>
    );

    const renderFloaters = () => (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
        </>
    );

    const computeGroupFlags = (group: SelectOptionGroup<T>) =>
        ListboxUtils.computeGroupFlags(group, props.computeIsSelected);

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
                    ref={(element) => {
                        setElementRef(element);
                        setOptionRef(element, getFlatIndex);

                        onCleanup(() => dropOptionRef(element));
                    }}
                    id={() => cursor.getOptionId(getFlatIndex())}
                    isSelfScrolling={() => !getIsVirtualized()}
                    focusModel={cursor.focusModel}
                    flags={getFlags}
                    renderContent={(getOptionFlags) => props.renderOption(getOption, getOptionFlags)}
                    onFocus={isRoving ? () => cursor.highlight(getOption().value) : undefined}
                    onSelect={() => cursor.pick(getOption().value)}
                />
            )}
        />
    );

    const renderEndMarker = () => (
        <Show when={getHasMoreOptions() && cursor.getOptions()} keyed>
            {(_items: SelectItem<T>[]) => (
                <div ref={setEndMarkerRef} class={styles.listboxEndMarker} aria-hidden="true" />
            )}
        </Show>
    );

    const renderMountedOptions = () => (
        <div
            ref={setOptionsRef}
            class={[styles.listboxOptions, getIsHorizontal() ? styles.listboxHorizontal : ""].join(" ")}
            role="presentation"
            onPointerOver={handleOptionsPointerOver}
            onPointerLeave={handleOptionsPointerLeave}
        >
            {renderFloaters()}

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
                                    renderOptionSlot(
                                        getOption,
                                        () => cursor.getItemRows()[index].entryOffset + groupIndex,
                                    )
                                }
                            </Index>
                        </div>
                    </Show>
                )}
            </Index>

            {renderEndMarker()}
        </div>
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

    const getWindowedRuns = createMemo(() => ListboxUtils.getWindowedRuns(rowWindow.getRows(), cursor.getRows()));

    const getWindowedEntries = createMemo(() =>
        getWindowedRuns().flatMap<VirtualizerRow | number>((run) =>
            run.groupIndex === undefined ? run.rows : [run.groupIndex],
        ),
    );

    const getGroupRun = (groupIndex: number) => getWindowedRuns().find((run) => run.groupIndex === groupIndex);

    let hadFocus = false;

    createComputed(() => {
        getWindowedEntries();

        hadFocus = getSizerRef()?.contains(document.activeElement) ?? false;
    });

    createEffect(() => {
        getWindowedEntries();

        const index = untrack(cursor.getHighlightedIndex);

        if (!hadFocus || index === undefined || getSizerRef()?.contains(document.activeElement)) return;

        ListboxUtils.focusOption(untrack(cursor.getListboxId), index);
    });

    const renderWindowedOptions = () => (
        <div
            ref={setSizerRef}
            class={styles.listboxSizer}
            style={{ height: `${rowWindow.getTotalSize()}px` }}
            onPointerOver={handleOptionsPointerOver}
            onPointerLeave={handleOptionsPointerLeave}
        >
            {renderFloaters()}

            <For each={getWindowedEntries()}>
                {(entry) =>
                    typeof entry === "number" ? (
                        <div role="group" aria-label={getGroupRun(entry)?.group?.label}>
                            <For each={getGroupRun(entry)?.rows}>{renderWindowedRow}</For>
                        </div>
                    ) : (
                        renderWindowedRow(entry)
                    )
                }
            </For>
        </div>
    );

    return (
        <Show when={getIsVirtualized()} fallback={renderMountedOptions()}>
            {renderWindowedOptions()}

            {renderEndMarker()}
        </Show>
    );
};

export const ListboxComposite = <T,>(props: ListboxCompositeProps<T>) => {
    const fallbackId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getOrientation = createMemo(() => access(props.orientation) ?? LISTBOX_DEFAULTS.orientation);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsMultiple = createMemo(() => access(props.isMultiple) ?? false);

    const getListboxId = createMemo(() => access(props.id) ?? fallbackId);

    const cursor = ListboxSolidUtils.createCursor<T>({
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
                floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                renderSelectionFloater={props.renderSelectionFloater}
                renderHighlightFloater={props.renderHighlightFloater}
                onReachEnd={props.onReachEnd}
            />
        </div>
    );
};

export const Listbox = <T,>(props: ListboxProps<T>) => {
    const valueSignal = accessSignal(() => props.value);

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
