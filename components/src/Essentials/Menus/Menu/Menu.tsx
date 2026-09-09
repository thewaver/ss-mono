import type { JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Point2d, Rect } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import { InteractionTracker } from "../../../Abstracts/InteractionTracker/InteractionTracker";
import type { NavigatorOrientation } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { PlacementBox, PlacementItem } from "../../../Abstracts/Placement/Placement";
import { PlacementUtils } from "../../../Abstracts/Placement/Placement.utils";
import { SignalMirror } from "../../../Abstracts/SignalMirror/SignalMirror";
import { Typeahead } from "../../../Abstracts/Typeahead/Typeahead";
import { TypeaheadUtils } from "../../../Abstracts/Typeahead/Typeahead.utils";
import { useViewportContext } from "../../../Exotics/Viewport/Viewport.context";
import { ViewportUtils } from "../../../Exotics/Viewport/Viewport.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { LabelUtils } from "../../Input/Label/Label.utils";
import { Popover } from "../../Popover/Popover";
import type {
    ContextMenuProps,
    MenuHighlightPosition,
    MenuItem,
    MenuItemKind,
    MenuItemViewProps,
    MenuLevelProps,
    MenuProps,
    MenuSubmenuMode,
    MenuSubmenuTrigger,
    MenuTriggerProps,
} from "./Menu.types";
import { MenuUtils } from "./Menu.utils";

import * as styles from "./Menu.css";

const EMPTY_CHECKED: never[] = [];

const DEFAULT_SUBMENU_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
const ROOT_LEVEL = 0;
const ROOT_PATH: number[] = [];
const NO_PARENT_WIDTH = 0;
const SAME_POINT_PX = 1;
const DEFAULT_SUBMENU_MODE: MenuSubmenuMode = "cascade";
const DEFAULT_SUBMENU_TRIGGER: MenuSubmenuTrigger = "hover";
const BACK_INDEX = 0;
const SUBMENU_OPEN_KEY = "ArrowRight";
const SUBMENU_CLOSE_KEY = "ArrowLeft";
const LEVEL_CLOSE_KEY = "Escape";
const PLACED_ORIENTATION: NavigatorOrientation = "both";
const PRIMARY_BUTTON = 0;
const NO_WIDTH = 0;
const FLICK_TRAVEL_RATIO = 0.1;

const createPointerPointReader = () => {
    let point: Point2d | undefined;

    const handleMove = (e: PointerEvent) => {
        point = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("pointermove", handleMove, { passive: true });

    onCleanup(() => document.removeEventListener("pointermove", handleMove));

    return () => point;
};

const MenuTrigger = (props: MenuTriggerProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
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

const MENU_ITEM_ROLES: Record<MenuItemKind, "menuitem" | "menuitemcheckbox" | "menuitemradio"> = {
    command: "menuitem",
    checkbox: "menuitemcheckbox",
    radio: "menuitemradio",
};

const MenuItemView = (props: MenuItemViewProps) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getHasSubmenu = () => access(props.flags).hasSubmenu;

    const getIsOpen = () => access(props.flags).isOpen;

    createEffect(() => {
        if (!access(props.flags).isHighlighted) return;

        getElementRef()?.scrollIntoView({ block: "nearest" });
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
            role={MENU_ITEM_ROLES[access(props.kind)]}
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
    const [getLayoutRootRef, setLayoutRootRef] = createSignal<HTMLElement>();

    const typeahead = Typeahead.createBuffer();

    const getHasBackEntry = () => access(props.submenuMode) === "replace" && access(props.openerItem) !== undefined;

    const getIsBackAt = (index: number) => getHasBackEntry() && index === BACK_INDEX;

    const getEntries = createMemo(() => {
        const opener = access(props.openerItem);

        return getHasBackEntry() && opener ? [opener, ...access(props.items)] : access(props.items);
    });

    const getNavigableIndexes = createMemo(() =>
        getEntries().reduce<number[]>((acc, item, index) => {
            const isReachable = InteractionTracker.computeIsReachable(
                item.isDisabled ?? false,
                item.isReachableWhenDisabled ?? false,
                item.tooltipDefs !== undefined,
            );

            if (!item.isDisabled || isReachable) acc.push(index);

            return acc;
        }, []),
    );

    const getHighlightedIndex = createMemo(() => {
        if (!access(props.isOpen)) return undefined;

        const navigable = getNavigableIndexes();
        const items = getEntries();
        const highlightedValue = getHighlightedValue();

        const highlightedIndex = navigable.find((index) => items[index].value === highlightedValue);

        if (highlightedIndex !== undefined) return highlightedIndex;

        if (access(props.initialHighlightPosition) === "last") return navigable[navigable.length - 1];

        return navigable.find((index) => !getIsBackAt(index)) ?? navigable[0];
    });

    const getActiveItemId = createMemo(() => {
        const highlightedIndex = getHighlightedIndex();

        if (highlightedIndex === undefined) return;

        return getItemId(highlightedIndex);
    });

    const getItemId = (index: number) => `${access(props.id)}-item-${index}`;

    const computeItemText = (index: number) =>
        props.computeCustomText?.(getEntries()[index]) ??
        TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

    const getSubmenuId = (index: number) => `${access(props.id)}-submenu-${index}`;

    const computeHasSubmenu = (index: number) => !getIsBackAt(index) && (getEntries()[index].items?.length ?? 0) > 0;

    const getLayout = createMemo(() =>
        props.computeLayout?.({
            itemCount: getEntries().length,
            path: access(props.path),
            parentWidth: access(props.parentWidth),
            parentPlacement: access(props.parentPlacement),
        }),
    );

    const getIsLaidOut = () => getLayout() !== undefined;

    const getIsCovered = () => access(props.submenuMode) === "replace" && getOpenValue() !== undefined;

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const highlightIndex = (index: number | undefined) => {
        if (index === undefined) return;

        setHighlightedValue(() => getEntries()[index].value);
    };

    const openIndex = (index: number) => {
        setHighlightedValue(() => getEntries()[index].value);
        setOpenValue(() => getEntries()[index].value);
    };

    const getIsPointerLed = (e: MouseEvent) => {
        const point = props.getPointerPoint();

        return (
            point === undefined ||
            Math.abs(point.x - e.clientX) >= SAME_POINT_PX ||
            Math.abs(point.y - e.clientY) >= SAME_POINT_PX
        );
    };

    const toLayoutPoint = (point: Point2d) => {
        const box = getLayoutRootRef()?.getBoundingClientRect();

        if (box === undefined || box.width <= NO_WIDTH) return undefined;

        return { x: (point.x - box.left) / box.width, y: (point.y - box.top) / box.width };
    };

    const pickFlickIndex = (point: Point2d) => {
        const layout = getLayout();
        const origin = access(props.flickOrigin);

        if (layout === undefined || origin === undefined) return undefined;

        const from = toLayoutPoint(origin);
        const to = toLayoutPoint(point);

        if (from === undefined || to === undefined) return undefined;
        if (PlacementUtils.getDistance(from, to) < FLICK_TRAVEL_RATIO) return undefined;

        return PlacementUtils.pickIndex({
            layout,
            point: to,
            isPickable: (index) => getNavigableIndexes().includes(index),
        });
    };

    const flickTo = (point: Point2d) => {
        const index = pickFlickIndex(point);

        setHighlightedValue(() => (index === undefined ? undefined : getEntries()[index].value));

        return index;
    };

    const hoverIndex = (index: number, e: MouseEvent) => {
        if (!getNavigableIndexes().includes(index)) return;
        if (!getIsPointerLed(e)) return;

        const item = getEntries()[index];

        setHighlightedValue(() => item.value);

        if (access(props.submenuOpensOn) !== "hover") return;

        setOpenValue(() => (computeHasSubmenu(index) && !item.isDisabled ? item.value : undefined));
    };

    const activateIndex = (index: number) => {
        if (getIsBackAt(index)) {
            props.onClose();

            return;
        }

        if (computeHasSubmenu(index)) {
            openIndex(index);

            return;
        }

        const items = getEntries();

        props.onPick(items[index], MenuUtils.getRadioGroupValues(items, index));
    };

    createEffect(() => {
        if (access(props.isOpen)) return;

        setHighlightedValue(() => undefined);
        setOpenValue(() => undefined);
    });

    createEffect(() => {
        if (access(props.flickOrigin) === undefined) return;

        const toPoint = (e: PointerEvent) => ({ x: e.clientX, y: e.clientY });

        const handleMove = (e: PointerEvent) => {
            flickTo(toPoint(e));
        };

        const handleUp = (e: PointerEvent) => {
            const index = flickTo(toPoint(e));

            props.onFlickEnd?.();

            if (index !== undefined) activateIndex(index);
        };

        const handleCancel = () => {
            setHighlightedValue(() => undefined);
            props.onFlickEnd?.();
        };

        document.addEventListener("pointermove", handleMove, { passive: true });
        document.addEventListener("pointerup", handleUp);
        document.addEventListener("pointercancel", handleCancel);

        onCleanup(() => {
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleUp);
            document.removeEventListener("pointercancel", handleCancel);
        });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement) || e.target.id !== access(props.id)) return;

        const items = getEntries();
        const navigable = getNavigableIndexes();
        const highlightedIndex = getHighlightedIndex();

        if (e.key === "Tab") {
            e.preventDefault();
            props.onDismiss();

            return;
        }

        const query = typeahead.push(e);

        if (query !== undefined) {
            e.preventDefault();

            const navigableFrom = navigable.indexOf(highlightedIndex ?? -1);
            const position = TypeaheadUtils.computeNextIndex(query, navigableFrom, navigable.length, (index) =>
                computeItemText(navigable[index]),
            );

            if (position !== undefined) highlightIndex(navigable[position]);

            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            if (highlightedIndex === undefined || items[highlightedIndex].isDisabled) return;

            activateIndex(highlightedIndex);

            return;
        }

        if (e.key === LEVEL_CLOSE_KEY && getIsLaidOut() && access(props.path).length > ROOT_LEVEL) {
            e.preventDefault();
            e.stopImmediatePropagation();
            props.onClose();

            return;
        }

        if (!getIsLaidOut() && e.key === SUBMENU_OPEN_KEY && highlightedIndex !== undefined) {
            if (items[highlightedIndex].isDisabled || !computeHasSubmenu(highlightedIndex)) return;

            e.preventDefault();
            openIndex(highlightedIndex);

            return;
        }

        if (!getIsLaidOut() && e.key === SUBMENU_CLOSE_KEY && access(props.path).length > ROOT_LEVEL) {
            e.preventDefault();
            props.onClose();

            return;
        }

        const positions = getNavigableIndexes();

        if (positions.length < 1) return;

        const from = positions.indexOf(highlightedIndex ?? positions[0]);
        const position = NavigatorUtils.computeNextPosition(e.key, from, positions.length, {
            orientation: getIsLaidOut() ? PLACED_ORIENTATION : undefined,
        });

        if (position === undefined) return;

        e.preventDefault();
        highlightIndex(positions[position]);
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
                                path={() => [...access(props.path), index]}
                                parentWidth={() => getLayout()?.width ?? NO_PARENT_WIDTH}
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
                                computeCustomText={props.computeCustomText}
                                getPointerPoint={props.getPointerPoint}
                                renderItem={props.renderItem}
                                renderPopup={props.renderPopup}
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
        <Show when={getLayout()} fallback={renderRuns()}>
            {(getResolved) => (
                <PlacementBox layout={getResolved} ref={setLayoutRootRef}>
                    {renderRuns()}
                </PlacementBox>
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
    const [getIsOpen, setIsOpen] = SignalMirror.createOptional(() => props.visibilitySignal, false);
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

    const getCheckedValues = createMemo(() => props.checkedSignal?.[0]() ?? EMPTY_CHECKED);

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const kind = MenuUtils.getKind(item);
        const checkedSignal = props.checkedSignal;

        if (kind !== "command" && checkedSignal) {
            const checked = checkedSignal[0]();

            checkedSignal[1](
                kind === "checkbox"
                    ? checked.includes(item.value)
                        ? checked.filter((value) => value !== item.value)
                        : [...checked, item.value]
                    : [...checked.filter((value) => !radioGroupValues.includes(value)), item.value],
            );
        }

        props.onActivate(item.value);

        if (kind !== "checkbox") close();
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

        if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

        e.preventDefault();

        open(e.key === "ArrowUp" ? "last" : "first");
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
                        path={ROOT_PATH}
                        parentWidth={NO_PARENT_WIDTH}
                        initialHighlightPosition={getInitialHighlightPosition}
                        anchorRef={() => access(props.anchorRef) ?? getTriggerRef()}
                        triggerRef={getTriggerRef}
                        placement={props.placement}
                        offset={props.offset}
                        submenuPlacement={() => access(props.submenuPlacement) ?? DEFAULT_SUBMENU_PLACEMENT}
                        submenuOffset={props.submenuOffset}
                        submenuMode={() => access(props.submenuMode) ?? DEFAULT_SUBMENU_MODE}
                        submenuOpensOn={() => access(props.submenuOpensOn) ?? DEFAULT_SUBMENU_TRIGGER}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        openerFlags={getFlags}
                        checkedValues={getCheckedValues}
                        computeLayout={props.computeLayout}
                        computeCustomText={props.computeCustomText}
                        getPointerPoint={getPointerPoint}
                        flickOrigin={getFlickOrigin}
                        renderItem={props.renderItem}
                        renderPopup={props.renderPopup}
                        onPick={pick}
                        onFlickEnd={() => setFlickOrigin(() => undefined)}
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

    const [getAnchorRect, setAnchorRect] = createSignal<Rect | undefined>(undefined, { equals: Rect.isSame });
    const [getIsOpen, setIsOpen] = SignalMirror.createOptional(() => props.visibilitySignal, false);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const close = () => {
        setIsOpen(false);
    };

    const getCheckedValues = createMemo(() => props.checkedSignal?.[0]() ?? EMPTY_CHECKED);

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const kind = MenuUtils.getKind(item);
        const checkedSignal = props.checkedSignal;

        if (kind !== "command" && checkedSignal) {
            const checked = checkedSignal[0]();

            checkedSignal[1](
                kind === "checkbox"
                    ? checked.includes(item.value)
                        ? checked.filter((value) => value !== item.value)
                        : [...checked, item.value]
                    : [...checked.filter((value) => !radioGroupValues.includes(value)), item.value],
            );
        }

        props.onActivate(item.value);

        if (kind !== "checkbox") close();
    };

    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    createEffect(() => {
        const region = access(props.regionRef);

        if (!region) return;

        const handleContextMenu = (e: MouseEvent) => {
            if (getIsDisabled()) return;

            const point = ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext);

            e.preventDefault();
            setAnchorRect({ x: point.x, y: point.y, width: 0, height: 0 });
            setIsOpen(true);
        };

        region.addEventListener("contextmenu", handleContextMenu);

        onCleanup(() => {
            region.removeEventListener("contextmenu", handleContextMenu);
        });
    });

    return (
        <MenuLevel
            id={() => menuId}
            ariaLabel={props.ariaLabel}
            items={props.items}
            isOpen={getIsOpen}
            path={ROOT_PATH}
            parentWidth={NO_PARENT_WIDTH}
            anchorRef={props.regionRef}
            anchorRect={getAnchorRect}
            triggerRef={props.regionRef}
            placement={props.placement}
            offset={props.offset}
            submenuPlacement={() => access(props.submenuPlacement) ?? DEFAULT_SUBMENU_PLACEMENT}
            submenuOffset={props.submenuOffset}
            submenuMode={() => access(props.submenuMode) ?? DEFAULT_SUBMENU_MODE}
            submenuOpensOn={() => access(props.submenuOpensOn) ?? DEFAULT_SUBMENU_TRIGGER}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            openerFlags={() => ({ isOpen: getIsOpen() })}
            checkedValues={getCheckedValues}
            computeLayout={props.computeLayout}
            computeCustomText={props.computeCustomText}
            getPointerPoint={getPointerPoint}
            renderItem={props.renderItem}
            renderPopup={props.renderPopup}
            onPick={pick}
            onClose={close}
            onDismiss={close}
        />
    );
};
