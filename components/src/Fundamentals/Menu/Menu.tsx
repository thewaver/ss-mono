import type { JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Rect } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirror } from "../../Abstracts/SignalMirror/SignalMirror";
import { Typeahead } from "../../Abstracts/Typeahead/Typeahead";
import { TypeaheadUtils } from "../../Abstracts/Typeahead/Typeahead.utils";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { ViewportUtils } from "../../Exotics/Viewport/Viewport.utils";
import { access } from "../../Utils/propUtils";
import { LabelUtils } from "../Input/Label/Label.utils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import { Popover } from "../Popover/Popover";
import type {
    ContextMenuProps,
    MenuHighlightPosition,
    MenuItem,
    MenuItemKind,
    MenuItemViewProps,
    MenuLevelProps,
    MenuProps,
    MenuTriggerProps,
} from "./Menu.types";
import { MenuUtils } from "./Menu.utils";

import * as styles from "./Menu.css";

const EMPTY_CHECKED: never[] = [];

const DEFAULT_SUBMENU_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
const SUBMENU_OPEN_KEY = "ArrowRight";
const SUBMENU_CLOSE_KEY = "ArrowLeft";

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
            aria-haspopup="menu"
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            aria-expanded={access(props.flags).isOpen}
            aria-controls={access(props.flags).isOpen ? access(props.menuId) : undefined}
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
            role={MENU_ITEM_ROLES[access(props.kind)]}
            aria-disabled={getIsDisabled() || undefined}
            aria-checked={access(props.kind) === "command" ? undefined : access(props.flags).isChecked}
            aria-haspopup={getHasSubmenu() ? "menu" : undefined}
            aria-expanded={getHasSubmenu() ? getIsOpen() : undefined}
            aria-controls={getIsOpen() ? access(props.submenuId) : undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
            onMouseEnter={() => props.onHover()}
        >
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

const MenuLevel = <T,>(props: MenuLevelProps<T>): JSX.Element => {
    const [getHighlightedValue, setHighlightedValue] = createSignal<T | undefined>();
    const [getOpenValue, setOpenValue] = createSignal<T | undefined>();

    const typeahead = Typeahead.createBuffer();

    const getNavigableIndexes = createMemo(() =>
        access(props.items).reduce<number[]>((acc, item, index) => {
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
        const navigable = getNavigableIndexes();
        const items = access(props.items);
        const highlightedValue = getHighlightedValue();

        const highlightedIndex = navigable.find((index) => items[index].value === highlightedValue);

        if (highlightedIndex !== undefined) return highlightedIndex;

        if (access(props.initialHighlightPosition) === "last") return navigable[navigable.length - 1];

        return navigable[0];
    });

    const getActiveItemId = createMemo(() => {
        const highlightedIndex = getHighlightedIndex();

        if (!access(props.isOpen) || highlightedIndex === undefined) return;

        return `${access(props.id)}-item-${highlightedIndex}`;
    });

    const getItemId = (index: number) => `${access(props.id)}-item-${index}`;

    const computeItemText = (index: number) =>
        props.computeCustomText?.(access(props.items)[index]) ??
        TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

    const getSubmenuId = (index: number) => `${access(props.id)}-submenu-${index}`;

    const computeHasSubmenu = (index: number) => (access(props.items)[index].items?.length ?? 0) > 0;

    const highlightIndex = (index: number | undefined) => {
        if (index === undefined) return;

        setHighlightedValue(() => access(props.items)[index].value);
    };

    const openIndex = (index: number) => {
        setHighlightedValue(() => access(props.items)[index].value);
        setOpenValue(() => access(props.items)[index].value);
    };

    const hoverIndex = (index: number) => {
        if (!getNavigableIndexes().includes(index)) return;

        const item = access(props.items)[index];

        if (computeHasSubmenu(index) && !item.isDisabled) {
            openIndex(index);

            return;
        }

        setHighlightedValue(() => item.value);
        setOpenValue(() => undefined);
    };

    const activateIndex = (index: number) => {
        if (computeHasSubmenu(index)) {
            openIndex(index);

            return;
        }

        const items = access(props.items);

        props.onPick(items[index], MenuUtils.getRadioGroupValues(items, index));
    };

    createEffect(() => {
        if (access(props.isOpen)) return;

        setHighlightedValue(() => undefined);
        setOpenValue(() => undefined);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement) || e.target.id !== access(props.id)) return;

        const items = access(props.items);
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

        if (e.key === SUBMENU_OPEN_KEY && highlightedIndex !== undefined) {
            if (items[highlightedIndex].isDisabled || !computeHasSubmenu(highlightedIndex)) return;

            e.preventDefault();
            openIndex(highlightedIndex);

            return;
        }

        if (e.key === SUBMENU_CLOSE_KEY && access(props.isSubmenu)) {
            e.preventDefault();
            props.onClose();

            return;
        }

        if (navigable.length < 1) return;

        const from = navigable.indexOf(highlightedIndex ?? navigable[0]);
        const position = NavigatorUtils.computeNextPosition(e.key, from, navigable.length);

        if (position === undefined) return;

        e.preventDefault();
        highlightIndex(navigable[position]);
    };

    const renderItemAt = (getItem: () => MenuItem<T>, index: number) => {
        const [getItemRef, setItemRef] = createSignal<HTMLElement>();

        const getIsSubmenuOpen = () => computeHasSubmenu(index) && getOpenValue() === getItem().value;

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
                            submenuId={() => getSubmenuId(index)}
                            flags={getFlags}
                            renderContent={(getItemFlags) => props.renderItem(getItem, getItemFlags)}
                            onActivate={() => activateIndex(index)}
                            onHover={() => hoverIndex(index)}
                        />

                        <Show when={computeHasSubmenu(index)}>
                            <MenuLevel
                                id={() => getSubmenuId(index)}
                                labelledBy={() => getItemId(index)}
                                items={() => getItem().items!}
                                isOpen={getIsSubmenuOpen}
                                isSubmenu={true}
                                anchorRef={getItemRef}
                                triggerRef={props.triggerRef}
                                placement={props.submenuPlacement}
                                offset={props.submenuOffset}
                                submenuPlacement={props.submenuPlacement}
                                submenuOffset={props.submenuOffset}
                                reservedScreenSize={props.reservedScreenSize}
                                transitionDurationMs={props.transitionDurationMs}
                                openerFlags={getFlags}
                                checkedValues={props.checkedValues}
                                computeCustomText={props.computeCustomText}
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

    const renderItems = () => (
        <For each={MenuUtils.getRuns(access(props.items))}>
            {(run) => (
                <Show
                    when={run.isRadioGroup}
                    fallback={
                        <Index each={run.items}>{(getItem, index) => renderItemAt(getItem, run.from + index)}</Index>
                    }
                >
                    <div role="group">
                        <Index each={run.items}>{(getItem, index) => renderItemAt(getItem, run.from + index)}</Index>
                    </div>
                </Show>
            )}
        </For>
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

    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirror.createOptional(() => props.visibilitySignal, false);
    const [getInitialHighlightPosition, setInitialHighlightPosition] = createSignal<MenuHighlightPosition>("first");

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

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
                        onToggle={() => (getIsOpen() ? close() : open("first"))}
                        onKeyDown={handleTriggerKeyDown}
                    />

                    <MenuLevel
                        id={() => menuId}
                        labelledBy={getTriggerId}
                        items={props.items}
                        isOpen={getIsOpen}
                        isSubmenu={false}
                        initialHighlightPosition={getInitialHighlightPosition}
                        anchorRef={() => access(props.anchorRef) ?? getTriggerRef()}
                        triggerRef={getTriggerRef}
                        placement={props.placement}
                        offset={props.offset}
                        submenuPlacement={() => access(props.submenuPlacement) ?? DEFAULT_SUBMENU_PLACEMENT}
                        submenuOffset={props.submenuOffset}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        openerFlags={getFlags}
                        checkedValues={getCheckedValues}
                        computeCustomText={props.computeCustomText}
                        renderItem={props.renderItem}
                        renderPopup={props.renderPopup}
                        onPick={pick}
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
            isSubmenu={false}
            anchorRef={props.regionRef}
            anchorRect={getAnchorRect}
            triggerRef={props.regionRef}
            placement={props.placement}
            offset={props.offset}
            submenuPlacement={() => access(props.submenuPlacement) ?? DEFAULT_SUBMENU_PLACEMENT}
            submenuOffset={props.submenuOffset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            openerFlags={() => ({ isOpen: getIsOpen() })}
            checkedValues={getCheckedValues}
            computeCustomText={props.computeCustomText}
            renderItem={props.renderItem}
            renderPopup={props.renderPopup}
            onPick={pick}
            onClose={close}
            onDismiss={close}
        />
    );
};
