import type { JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup, untrack } from "solid-js";

import {
    MENU_DEFAULTS,
    type MenuHighlightPosition,
    MenuUtils,
    TypeaheadUtils,
    FloaterStyles as floaterStyles,
    MenuStyles as styles,
} from "@thewaver/ss-components";
import { Point2d, Rect } from "@thewaver/ss-utils";

import { FloaterSolidUtils } from "../../../Abstracts/Floater/FloaterSolid.utils";
import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { TypeaheadSolidUtils } from "../../../Abstracts/Typeahead/TypeaheadSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access } from "../../../Utils/propUtils";
import { LabelSolidUtils } from "../../Input/Label/LabelSolid.utils";
import type {
    ContextMenuProps,
    MenuItem,
    MenuItemViewProps,
    MenuLevelProps,
    MenuProps,
    MenuTriggerProps,
} from "./MenuSolid.types";

const EMPTY_CHECKED: never[] = [];

const ROOT_PATH: number[] = [];
const NO_PARENT_EXTENT = 0;
const PRIMARY_BUTTON = 0;

const createPointerPointReader = () => {
    onCleanup(MenuUtils.observePointerPoint());

    return MenuUtils.getPointerPoint;
};

const MenuTrigger = (props: MenuTriggerProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.menuTrigger}
            classList={{ [styles.menuTriggerHoldable]: access(props.isHoldable) }}
            role={access(props.role)}
            aria-haspopup="menu"
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            aria-expanded={access(props.flags).isOpen}
            aria-controls={access(props.flags).isOpen ? access(props.menuId) : undefined}
            onPointerDown={(e) => {
                if (getIsDisabled()) return;

                props.onPress(e);
            }}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onToggle();
            }}
            onKeyDown={props.onKeyDown}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};

const MenuItemView = (props: MenuItemViewProps) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getHasSubmenu = () => access(props.flags).hasSubmenu;

    const getIsOpen = () => access(props.flags).isOpen;

    const getIsHighlighted = createMemo(() => access(props.flags).isHighlighted ?? false);

    createEffect(() => {
        const element = getElementRef();

        if (!getIsHighlighted() || !element) return;

        MenuUtils.revealItem(element);
    });

    return (
        <div
            id={access(props.id)}
            ref={(element) => {
                setElementRef(element);
                props.ref?.(element);
            }}
            class={styles.menuItem}
            classList={{ [styles.menuItemRegion]: access(props.isRegion) }}
            role={MenuUtils.getItemRole(access(props.kind))}
            aria-label={access(props.ariaLabel) || undefined}
            aria-disabled={getIsDisabled() || undefined}
            aria-checked={access(props.kind) === "command" ? undefined : access(props.flags).isChecked}
            aria-haspopup={getHasSubmenu() ? "menu" : undefined}
            aria-expanded={getHasSubmenu() ? getIsOpen() : undefined}
            aria-controls={getIsOpen() ? access(props.submenuId) : undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
            onMouseEnter={(e) => props.onHover(e)}
        >
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

const MenuLevel = <T,>(props: MenuLevelProps<T>): JSX.Element => {
    const [getHighlightedValue, setHighlightedValue] = createSignal<T | undefined>();
    const [getOpenValue, setOpenValue] = createSignal<T | undefined>();
    const [getIsCoveredWhileClosing, setIsCoveredWhileClosing] = createSignal(false);
    const [getLayoutRootRef, setLayoutRootRef] = createSignal<HTMLElement>();

    const typeahead = TypeaheadSolidUtils.createBuffer();

    const getHasBackEntry = () =>
        MenuUtils.getHasBackEntry(access(props.submenuMode), access(props.openerItem) !== undefined);

    const getIsBackAt = (index: number) => MenuUtils.getIsBackAt(getHasBackEntry(), index);

    const getEntries = createMemo(() =>
        MenuUtils.computeEntries(access(props.items), access(props.openerItem), access(props.submenuMode)),
    );

    const getNavigableIndexes = createMemo(() => MenuUtils.computeNavigableIndexes(getEntries()));

    const getHighlightedIndex = createMemo(() =>
        MenuUtils.computeHighlightedIndex({
            isOpen: access(props.isOpen),
            entries: getEntries(),
            navigable: getNavigableIndexes(),
            highlightedValue: getHighlightedValue(),
            initialHighlightPosition: access(props.initialHighlightPosition),
            hasBackEntry: getHasBackEntry(),
        }),
    );

    const getActiveItemId = createMemo(() => {
        const highlightedIndex = getHighlightedIndex();

        if (highlightedIndex === undefined) return;

        return getItemId(highlightedIndex);
    });

    const getItemId = (index: number) => `${access(props.id)}-item-${index}`;

    const [getItemsRef, setItemsRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<Map<number, HTMLElement>>(new Map(), { equals: false });

    const recordItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((refs) => refs.set(index, element));

        onCleanup(() =>
            setItemRefs((refs) => {
                if (refs.get(index) === element) refs.delete(index);

                return refs;
            }),
        );
    };

    const computeItemText = (index: number) =>
        props.computeCustomText?.(getEntries()[index]) ??
        TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

    const getSubmenuId = (index: number) => `${access(props.id)}-submenu-${index}`;

    const computeHasSubmenu = (index: number) => MenuUtils.getHasSubmenu(getEntries(), index, getHasBackEntry());

    const getLayout = createMemo(() =>
        props.computeLayout?.({
            itemCount: getEntries().length,
            path: access(props.path),
            parentExtent: access(props.parentExtent),
            parentPlacement: access(props.parentPlacement),
        }),
    );

    const getIsLaidOut = () => getLayout() !== undefined;

    const getRootExtent = () => MenuUtils.computeRootExtent(access(props.rootExtent), getLayout());

    const getLayoutShift = () => MenuUtils.computeLayoutShift(getLayout());

    const getLayoutWidth = () =>
        MenuUtils.computeLayoutWidth(access(props.layoutSize), getLayout()?.extent, getRootExtent());

    const getIsCovered = () =>
        access(props.submenuMode) === "replace" && (getOpenValue() !== undefined || getIsCoveredWhileClosing());

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getFloaterTransitionDurationMs = createMemo(
        () => access(props.floaterTransitionDurationMs) ?? MENU_DEFAULTS.floaterTransitionDurationMs,
    );

    const highlightFloater = FloaterSolidUtils.create({
        getIsEnabled: () => props.renderHighlightFloater !== undefined,
        getContainer: getItemsRef,
        getTarget: () => {
            const index = getHighlightedIndex();

            return index === undefined ? undefined : getItemRefs().get(index);
        },
        getLayout,
        getPlacement: () => {
            const index = getHighlightedIndex();

            return index === undefined ? undefined : getPlacementAt(index);
        },
        getTransitionDurationMs: getFloaterTransitionDurationMs,
    });

    const renderHighlightFloater = () => (
        <Show when={highlightFloater.getIsRendered()}>
            <div
                ref={highlightFloater.setRef}
                class={floaterStyles.floater}
                style={{
                    ...highlightFloater.getBounds(),
                    "transition-duration": `${getFloaterTransitionDurationMs()}ms`,
                }}
            >
                {props.renderHighlightFloater?.(highlightFloater.getVisibilityTarget, getFloaterTransitionDurationMs)}
            </div>
        </Show>
    );

    const highlightIndex = (index: number | undefined) => {
        if (index === undefined) return;

        setHighlightedValue(() => getEntries()[index].value);
    };

    const openIndex = (index: number) => {
        setHighlightedValue(() => getEntries()[index].value);
        setOpenValue(() => getEntries()[index].value);
    };

    const getIsPointerLed = (e: MouseEvent) =>
        MenuUtils.getIsPointerLed(props.getPointerPoint(), { x: e.clientX, y: e.clientY });

    const flickTo = (point: Point2d) => {
        const index = MenuUtils.computeFlickIndex({
            layout: getLayout(),
            origin: access(props.flickOrigin),
            point,
            box: getLayoutRootRef()?.getBoundingClientRect(),
            navigable: getNavigableIndexes(),
        });

        setHighlightedValue(() => (index === undefined ? undefined : getEntries()[index].value));

        return index;
    };

    const hoverIndex = (index: number, e: MouseEvent) => {
        if (!getNavigableIndexes().includes(index)) return;
        if (!getIsPointerLed(e)) return;

        const item = getEntries()[index];

        setHighlightedValue(() => item.value);

        if (access(props.submenuOpensOn) !== "hover") return;

        setOpenValue(() =>
            MenuUtils.getOpensSubmenu(getEntries(), index, getHasBackEntry()) ? item.value : undefined,
        );
    };

    const activateIndex = (index: number) => {
        const activation = MenuUtils.computeActivation<T, MenuItem<T>>(getEntries(), index, getHasBackEntry());

        if (activation.type === "back") {
            props.onClose();

            return;
        }

        if (activation.type === "open") {
            openIndex(index);

            return;
        }

        props.onPick(activation.item, activation.radioGroupValues);
    };

    createEffect(() => {
        if (access(props.isOpen)) {
            setIsCoveredWhileClosing(false);

            return;
        }

        setIsCoveredWhileClosing(untrack(getIsCovered));
        setHighlightedValue(() => undefined);
        setOpenValue(() => undefined);
    });

    createEffect(() => {
        if (access(props.flickOrigin) === undefined) return;

        onCleanup(
            MenuUtils.observeFlick({
                onMove: (point) => {
                    flickTo(point);
                },
                onRelease: (point, releasedOn) => {
                    const index = flickTo(point);

                    props.onFlickEnd?.(releasedOn);

                    if (index !== undefined) activateIndex(index);
                },
                onCancel: () => {
                    setHighlightedValue(() => undefined);
                    props.onFlickEnd?.(undefined);
                },
            }),
        );
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement) || e.target.id !== access(props.id)) return;

        const navigable = getNavigableIndexes();
        const highlightedIndex = getHighlightedIndex();

        const query = typeahead.push(e);

        if (query !== undefined) {
            e.preventDefault();
            highlightIndex(MenuUtils.computeTypeaheadIndex(query, navigable, highlightedIndex, computeItemText));

            return;
        }

        const step = MenuUtils.computeLevelKeyStep(e.key, {
            entries: getEntries(),
            navigable,
            highlightedIndex,
            hasBackEntry: getHasBackEntry(),
            isLaidOut: getIsLaidOut(),
            depth: access(props.path).length,
            direction: access(props.direction),
        });

        if (step === undefined) return;

        e.preventDefault();

        if (step.type === "dismiss") props.onDismiss();
        else if (step.type === "activate") activateIndex(step.index);
        else if (step.type === "open") openIndex(step.index);
        else if (step.type === "highlight") highlightIndex(step.index);
        else if (step.type === "close") {
            if (step.isContained) e.stopImmediatePropagation();

            props.onClose();
        }
    };

    const renderItemAt = (getItem: () => MenuItem<T>, index: number) => {
        const [getItemRef, setItemRef] = createSignal<HTMLElement>();

        const getIsSubmenuOpen = () => computeHasSubmenu(index) && getOpenValue() === getItem().value;

        const getRect = () => getPlacementAt(index);

        return (
            <InteractionWrapper
                sizing={"fill"}
                isDisabled={() => getItem().isDisabled ?? false}
                isReachableWhenDisabled={() => getItem().isReachableWhenDisabled ?? false}
                isTabbable={false}
                tooltipDefs={() => getItem().tooltipDefs}
                extraFlags={() => ({
                    isHighlighted: index === getHighlightedIndex(),
                    hasSubmenu: computeHasSubmenu(index),
                    isBack: getIsBackAt(index),
                    isOpen: getIsSubmenuOpen(),
                    isChecked: access(props.checkedValues).includes(getItem().value),
                })}
                renderControl={(setElementRef, getFlags) => (
                    <>
                        <MenuItemView
                            kind={() => MenuUtils.getKind(getItem())}
                            ref={(element) => {
                                setElementRef(element);
                                setItemRef(element);
                                recordItemRef(index, element);
                            }}
                            id={() => getItemId(index)}
                            ariaLabel={() => getItem().ariaLabel ?? ""}
                            submenuId={() => getSubmenuId(index)}
                            flags={getFlags}
                            isRegion={() => getRect()?.sector !== undefined}
                            renderContent={(getItemFlags) => props.renderItem(getItem, getItemFlags, getRect)}
                            onActivate={() => activateIndex(index)}
                            onHover={(e) => hoverIndex(index, e)}
                        />

                        <Show when={computeHasSubmenu(index)}>
                            <MenuLevel
                                id={() => getSubmenuId(index)}
                                labelledBy={() => getItemId(index)}
                                items={() => getItem().items!}
                                isOpen={getIsSubmenuOpen}
                                direction={props.direction}
                                path={() => [...access(props.path), index]}
                                parentExtent={() => getLayout()?.extent ?? NO_PARENT_EXTENT}
                                rootExtent={() => getRootExtent()}
                                layoutSize={props.layoutSize}
                                parentPlacement={getRect}
                                anchorRef={getIsLaidOut() ? props.anchorRef : getItemRef}
                                anchorRect={getIsLaidOut() ? props.anchorRect : undefined}
                                triggerRef={props.triggerRef}
                                placement={getIsLaidOut() ? props.placement : props.submenuPlacement}
                                offset={getIsLaidOut() ? props.offset : props.submenuOffset}
                                submenuPlacement={props.submenuPlacement}
                                submenuOffset={props.submenuOffset}
                                submenuMode={props.submenuMode}
                                submenuOpensOn={props.submenuOpensOn}
                                openerItem={getItem}
                                reservedScreenSize={props.reservedScreenSize}
                                transitionDurationMs={props.transitionDurationMs}
                                openerFlags={getFlags}
                                checkedValues={props.checkedValues}
                                computeLayout={props.computeLayout}
                                computeEffect={props.computeEffect}
                                computeCustomText={props.computeCustomText}
                                getPointerPoint={props.getPointerPoint}
                                renderItem={props.renderItem}
                                renderPopup={props.renderPopup}
                                floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                                renderHighlightFloater={props.renderHighlightFloater}
                                onPick={props.onPick}
                                onClose={() => setOpenValue(() => undefined)}
                                onDismiss={props.onDismiss}
                            />
                        </Show>
                    </>
                )}
            />
        );
    };

    const renderPlaced = (index: number, element: JSX.Element) => {
        const getPlacement = createMemo(() => getPlacementAt(index));

        return (
            <Show when={getPlacement()} fallback={element}>
                {(getRect) => (
                    <PlacementItem placement={getRect} stackAt={index + 1}>
                        {element}
                    </PlacementItem>
                )}
            </Show>
        );
    };

    const renderRuns = () => (
        <For each={MenuUtils.getRuns(getEntries())}>
            {(run) => (
                <Show
                    when={run.isRadioGroup}
                    fallback={
                        <Index each={run.items}>
                            {(getItem, index) =>
                                renderPlaced(run.from + index, renderItemAt(getItem, run.from + index))
                            }
                        </Index>
                    }
                >
                    <div role="group" class={getLayout() ? styles.menuLayoutGroup : undefined}>
                        <Index each={run.items}>
                            {(getItem, index) =>
                                renderPlaced(run.from + index, renderItemAt(getItem, run.from + index))
                            }
                        </Index>
                    </div>
                </Show>
            )}
        </For>
    );

    const renderItems = () => (
        <Show
            when={getLayout()}
            fallback={
                <div ref={setItemsRef} class={styles.menuItems} role="presentation">
                    {renderHighlightFloater()}
                    {renderRuns()}
                </div>
            }
        >
            {(getResolved) => (
                <div style={{ width: getLayoutWidth(), transform: getLayoutShift() }}>
                    <PlacementBox layout={getResolved} ref={setLayoutRootRef} computeEffect={props.computeEffect}>
                        {renderHighlightFloater()}
                        {renderRuns()}
                    </PlacementBox>
                </div>
            )}
        </Show>
    );

    return (
        <Popover
            id={props.id}
            role={"menu"}
            ariaAttributes={() => ({
                "aria-labelledby": access(props.labelledBy),
                "aria-label": access(props.ariaLabel),
                "aria-activedescendant": getActiveItemId(),
            })}
            placement={props.placement}
            offset={props.offset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            hasAutoFocus={true}
            isTransparentToPointer={getIsLaidOut}
            isPinned={getIsLaidOut}
            isCovered={getIsCovered}
            isOpen={props.isOpen}
            anchorRef={props.anchorRef}
            anchorRect={props.anchorRect}
            onKeyDown={handleKeyDown}
            onDismiss={() => props.onClose()}
            renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) =>
                props.renderPopup(renderItems, getVisibilityTarget, getTransitionDurationMs, getPlacement, () =>
                    access(props.openerFlags),
                )
            }
        />
    );
};

export const Menu = <T,>(props: MenuProps<T>) => {
    const fallbackTriggerId = createUniqueId();
    const menuId = createUniqueId();
    const getPointerPoint = createPointerPointReader();

    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(() => access(props.anchorRef) ?? getTriggerRef());

    const [getInitialHighlightPosition, setInitialHighlightPosition] = createSignal<MenuHighlightPosition>("first");
    const [getFlickOrigin, setFlickOrigin] = createSignal<Point2d | undefined>();

    let isTogglePrevented = false;

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsHoldable = createMemo(() => access(props.opensOnHold) ?? false);

    const getTriggerId = createMemo(() => access(props.id) ?? fallbackTriggerId);

    const open = (position: MenuHighlightPosition) => {
        if (getIsDisabled() || getIsOpen()) return;

        setInitialHighlightPosition(position);
        setIsOpen(true);
    };
    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    const close = () => {
        setIsOpen(false);
        setFlickOrigin(() => undefined);
    };

    const getCheckedValues = createMemo(() => props.checked?.[0]() ?? EMPTY_CHECKED);

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const kind = MenuUtils.getKind(item);
        const checkedSignal = props.checked;

        if (kind !== "command" && checkedSignal) {
            checkedSignal[1](MenuUtils.computeNextChecked(checkedSignal[0](), item, radioGroupValues));
        }

        props.onActivate(item.value);

        if (!MenuUtils.getStaysOpenOnPick(item)) close();
    };

    const handleTriggerPress = (e: PointerEvent) => {
        if (!getIsHoldable() || e.button !== PRIMARY_BUTTON || getIsOpen()) return;

        isTogglePrevented = true;

        open("first");
        setFlickOrigin(() => ({ x: e.clientX, y: e.clientY }));
    };

    const handleTriggerToggle = () => {
        if (isTogglePrevented) {
            isTogglePrevented = false;

            return;
        }

        if (getIsOpen()) close();
        else open("first");
    };

    createEffect(() => {
        if (getIsOpen()) return;

        setInitialHighlightPosition("first");
    });

    const handleTriggerKeyDown = (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        const position = MenuUtils.getTriggerOpenPosition(e.key);

        if (position === undefined) return;

        e.preventDefault();

        open(position);
    };

    return (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({ isOpen: getIsOpen() })}
            ref={(element) => {
                setTriggerRef(element);
                props.ref?.(element);
            }}
            renderControl={(setElementRef, getFlags) => (
                <>
                    <MenuTrigger
                        ref={setElementRef}
                        id={getTriggerId}
                        ariaLabel={props.ariaLabel}
                        menuId={() => menuId}
                        role={() => access(props.triggerRole) ?? MENU_DEFAULTS.triggerRole}
                        flags={getFlags}
                        renderContent={props.renderContent}
                        isHoldable={getIsHoldable}
                        onToggle={handleTriggerToggle}
                        onPress={handleTriggerPress}
                        onKeyDown={handleTriggerKeyDown}
                    />

                    <MenuLevel
                        id={() => menuId}
                        labelledBy={getTriggerId}
                        items={props.items}
                        isOpen={getIsOpen}
                        direction={getDirection}
                        path={ROOT_PATH}
                        parentExtent={NO_PARENT_EXTENT}
                        rootExtent={NO_PARENT_EXTENT}
                        layoutSize={props.layoutSize}
                        initialHighlightPosition={getInitialHighlightPosition}
                        anchorRef={() => access(props.anchorRef) ?? getTriggerRef()}
                        triggerRef={getTriggerRef}
                        placement={props.placement}
                        offset={props.offset}
                        submenuPlacement={() =>
                            access(props.submenuPlacement) ?? MENU_DEFAULTS.submenuPlacement[getDirection()]
                        }
                        submenuOffset={props.submenuOffset}
                        submenuMode={() => access(props.submenuMode) ?? MENU_DEFAULTS.submenuMode}
                        submenuOpensOn={() => access(props.submenuOpensOn) ?? MENU_DEFAULTS.submenuOpensOn}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        openerFlags={getFlags}
                        checkedValues={getCheckedValues}
                        computeLayout={props.computeLayout}
                        computeEffect={props.computeEffect}
                        computeCustomText={props.computeCustomText}
                        getPointerPoint={getPointerPoint}
                        flickOrigin={getFlickOrigin}
                        renderItem={props.renderItem}
                        renderPopup={props.renderPopup}
                        floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                        renderHighlightFloater={props.renderHighlightFloater}
                        onPick={pick}
                        onFlickEnd={(releasedOn) => {
                            setFlickOrigin(() => undefined);

                            if (!releasedOn || !getTriggerRef()?.contains(releasedOn)) isTogglePrevented = false;
                        }}
                        onClose={close}
                        onDismiss={close}
                    />
                </>
            )}
        />
    );
};

export const ContextMenu = <T,>(props: ContextMenuProps<T>) => {
    const viewportContext = useViewportContext();
    const menuId = createUniqueId();
    const getPointerPoint = createPointerPointReader();

    const [getRegionRef, setRegionRef] = createSignal<HTMLElement>();
    const [getAnchorRect, setAnchorRect] = createSignal<Rect | undefined>(undefined, { equals: Rect.isSame });
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRegionRef);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const close = () => {
        setIsOpen(false);
    };

    const getCheckedValues = createMemo(() => props.checked?.[0]() ?? EMPTY_CHECKED);

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const kind = MenuUtils.getKind(item);
        const checkedSignal = props.checked;

        if (kind !== "command" && checkedSignal) {
            checkedSignal[1](MenuUtils.computeNextChecked(checkedSignal[0](), item, radioGroupValues));
        }

        props.onActivate(item.value);

        if (!MenuUtils.getStaysOpenOnPick(item)) close();
    };

    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    createEffect(() => {
        const region = getRegionRef();

        if (!region) return;

        onCleanup(
            MenuUtils.observeContextMenuRequests(region, {
                viewportContext,
                getIsDisabled,
                onRequest: (rect) => {
                    setAnchorRect(rect);
                    setIsOpen(true);
                },
            }),
        );
    });

    return (
        <>
            <div
                ref={setRegionRef}
                class={styles.contextMenuRegion}
                role="group"
                tabindex={getIsDisabled() ? -1 : 0}
                aria-label={access(props.regionAriaLabel)}
                aria-haspopup="menu"
                aria-expanded={getIsOpen()}
                aria-controls={getIsOpen() ? menuId : undefined}
                aria-disabled={getIsDisabled() || undefined}
            >
                {props.renderRegion()}
            </div>

            <MenuLevel
                id={() => menuId}
                ariaLabel={props.ariaLabel}
                items={props.items}
                isOpen={getIsOpen}
                direction={getDirection}
                path={ROOT_PATH}
                parentExtent={NO_PARENT_EXTENT}
                rootExtent={NO_PARENT_EXTENT}
                layoutSize={undefined}
                anchorRef={getRegionRef}
                anchorRect={getAnchorRect}
                triggerRef={getRegionRef}
                placement={props.placement}
                offset={props.offset}
                submenuPlacement={() =>
                    access(props.submenuPlacement) ?? MENU_DEFAULTS.submenuPlacement[getDirection()]
                }
                submenuOffset={props.submenuOffset}
                submenuMode={() => access(props.submenuMode) ?? MENU_DEFAULTS.submenuMode}
                submenuOpensOn={() => access(props.submenuOpensOn) ?? MENU_DEFAULTS.submenuOpensOn}
                reservedScreenSize={props.reservedScreenSize}
                transitionDurationMs={props.transitionDurationMs}
                openerFlags={() => ({ isOpen: getIsOpen() })}
                checkedValues={getCheckedValues}
                computeLayout={props.computeLayout}
                computeEffect={props.computeEffect}
                computeCustomText={props.computeCustomText}
                getPointerPoint={getPointerPoint}
                renderItem={props.renderItem}
                renderPopup={props.renderPopup}
                floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                renderHighlightFloater={props.renderHighlightFloater}
                onPick={pick}
                onClose={close}
                onDismiss={close}
            />
        </>
    );
};
