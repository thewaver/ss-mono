import {
    Fragment,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    MENU_DEFAULTS,
    type MenuFlags,
    type MenuHighlightPosition,
    type MenuItemFlags,
    MenuStyles,
    MenuUtils,
    TypeaheadUtils,
} from "@thewaver/ss-components";
import { type Point2d, Rect } from "@thewaver/ss-utils";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { TypeaheadReactUtils } from "../../../Abstracts/Typeahead/TypeaheadReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { Popover } from "../../../Primitives/Popover/Popover";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { LabelReactUtils } from "../../Input/Label/LabelReact.utils";
import type {
    ContextMenuProps,
    MenuEntryProps,
    MenuItem,
    MenuItemViewProps,
    MenuLevelProps,
    MenuProps,
    MenuTriggerProps,
} from "./Menu.types";

const EMPTY_CHECKED: never[] = [];

const ROOT_PATH: number[] = [];
const NO_PARENT_EXTENT = 0;
const PRIMARY_BUTTON = 0;

const usePointerPointReader = () => {
    useEffect(() => MenuUtils.observePointerPoint(), []);
};

const MenuTrigger = (props: MenuTriggerProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.flags.isDisabled ?? false;
    const isOpen = props.flags.isOpen;

    const className = [MenuStyles.menuTrigger, props.isHoldable && MenuStyles.menuTriggerHoldable]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            id={props.id}
            ref={props.ref}
            type="button"
            className={className}
            role={props.role}
            aria-haspopup="menu"
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
            aria-expanded={isOpen}
            aria-controls={isOpen ? props.menuId : undefined}
            onPointerDown={(e) => {
                if (isDisabled) return;

                props.onPress(e);
            }}
            onClick={() => {
                if (isDisabled) return;

                props.onToggle();
            }}
            onKeyDown={props.onKeyDown}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};

const MenuItemView = (props: MenuItemViewProps) => {
    const isDisabled = props.flags.isDisabled ?? false;
    const hasSubmenu = props.flags.hasSubmenu;
    const isOpen = props.flags.isOpen;

    const className = [MenuStyles.menuItem, props.isRegion && MenuStyles.menuItemRegion].filter(Boolean).join(" ");

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={className}
            role={MenuUtils.getItemRole(props.kind)}
            aria-label={props.ariaLabel || undefined}
            aria-disabled={isDisabled || undefined}
            aria-checked={props.kind === "command" ? undefined : props.flags.isChecked}
            aria-haspopup={hasSubmenu ? "menu" : undefined}
            aria-expanded={hasSubmenu ? isOpen : undefined}
            aria-controls={isOpen ? props.submenuId : undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onActivate();
            }}
            onMouseEnter={(e) => props.onHover({ x: e.clientX, y: e.clientY })}
        >
            {props.renderContent(props.flags)}
        </div>
    );
};

const MenuEntry = <T,>(props: MenuEntryProps<T>) => {
    const [itemElement, setItemElement] = useState<HTMLElement>();

    const level = props.level;
    const item = props.item;
    const index = props.index;
    const placement = props.placement;
    const itemId = `${level.id}-item-${index}`;
    const submenuId = `${level.id}-submenu-${index}`;
    const isLaidOut = props.isLaidOut;

    const path = useMemo(() => [...level.path, index], [level.path, index]);

    useEffect(() => {
        if (!props.isHighlighted || !itemElement) return;

        MenuUtils.revealItem(itemElement);
    }, [props.isHighlighted, itemElement]);

    const extraFlags: MenuItemFlags = {
        isHighlighted: props.isHighlighted,
        hasSubmenu: props.hasSubmenu,
        isBack: props.isBack,
        isOpen: props.isSubmenuOpen,
        isChecked: level.checkedValues.includes(item.value),
    };

    return (
        <InteractionWrapper<MenuItemFlags>
            sizing={"fill"}
            isDisabled={item.isDisabled ?? false}
            isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
            isTabbable={false}
            tooltipDefs={item.tooltipDefs}
            extraFlags={extraFlags}
            ref={(element) => setItemElement(element ?? undefined)}
            renderControl={(setElementRef, flags) => (
                <>
                    <MenuItemView
                        kind={MenuUtils.getKind(item)}
                        ref={setElementRef}
                        id={itemId}
                        ariaLabel={item.ariaLabel ?? ""}
                        submenuId={submenuId}
                        flags={flags}
                        isRegion={placement?.sector !== undefined}
                        renderContent={(itemFlags) => level.renderItem(item, itemFlags, placement)}
                        onActivate={() => props.onActivate(index)}
                        onHover={(point) => props.onHover(index, point)}
                    />

                    {props.hasSubmenu && (
                        <MenuLevel<T>
                            id={submenuId}
                            labelledBy={itemId}
                            items={item.items!}
                            isOpen={props.isSubmenuOpen}
                            direction={level.direction}
                            path={path}
                            parentExtent={props.levelExtent}
                            rootExtent={props.rootExtent}
                            layoutSize={level.layoutSize}
                            parentPlacement={placement}
                            anchorRef={isLaidOut ? level.anchorRef : itemElement}
                            anchorRect={isLaidOut ? level.anchorRect : undefined}
                            placement={isLaidOut ? level.placement : level.submenuPlacement}
                            offset={isLaidOut ? level.offset : level.submenuOffset}
                            submenuPlacement={level.submenuPlacement}
                            submenuOffset={level.submenuOffset}
                            submenuMode={level.submenuMode}
                            submenuOpensOn={level.submenuOpensOn}
                            openerItem={item}
                            reservedScreenSize={level.reservedScreenSize}
                            transitionDurationMs={level.transitionDurationMs}
                            openerFlags={flags}
                            checkedValues={level.checkedValues}
                            computeLayout={level.computeLayout}
                            computeEffect={level.computeEffect}
                            computeCustomText={level.computeCustomText}
                            renderItem={level.renderItem}
                            renderPopup={level.renderPopup}
                            onPick={level.onPick}
                            onClose={props.onSubmenuClose}
                            onDismiss={level.onDismiss}
                        />
                    )}
                </>
            )}
        />
    );
};

const MenuLevel = <T,>(props: MenuLevelProps<T>) => {
    const [highlightedValue, setHighlightedValue] = useState<T | undefined>();
    const [openValue, setOpenValue] = useState<T | undefined>();
    const [isCoveredWhileClosing, setIsCoveredWhileClosing] = useState(false);
    const [wasOpen, setWasOpen] = useState(props.isOpen);

    const layoutRootRef = useRef<HTMLElement | null>(null);

    const typeahead = TypeaheadReactUtils.useBuffer();

    const hasBackEntry = MenuUtils.getHasBackEntry(props.submenuMode, props.openerItem !== undefined);
    const isCovered = props.submenuMode === "replace" && (openValue !== undefined || isCoveredWhileClosing);

    if (wasOpen !== props.isOpen) {
        setWasOpen(props.isOpen);

        if (props.isOpen) {
            setIsCoveredWhileClosing(false);
        } else {
            setIsCoveredWhileClosing(isCovered);
            setHighlightedValue(undefined);
            setOpenValue(undefined);
        }
    }

    const entries = useMemo(
        () => MenuUtils.computeEntries(props.items, props.openerItem, props.submenuMode),
        [props.items, props.openerItem, props.submenuMode],
    );

    const navigable = useMemo(() => MenuUtils.computeNavigableIndexes(entries), [entries]);

    const highlightedIndex = MenuUtils.computeHighlightedIndex({
        isOpen: props.isOpen,
        entries,
        navigable,
        highlightedValue,
        initialHighlightPosition: props.initialHighlightPosition,
        hasBackEntry,
    });

    const computeLayout = props.computeLayout;
    const itemCount = entries.length;

    const layout = useMemo(
        () =>
            computeLayout?.({
                itemCount,
                path: props.path,
                parentExtent: props.parentExtent,
                parentPlacement: props.parentPlacement,
            }),
        [computeLayout, itemCount, props.path, props.parentExtent, props.parentPlacement],
    );

    const isLaidOut = layout !== undefined;
    const rootExtent = MenuUtils.computeRootExtent(props.rootExtent, layout);

    const getItemId = (index: number) => `${props.id}-item-${index}`;

    const activeItemId = highlightedIndex === undefined ? undefined : getItemId(highlightedIndex);

    const computeItemText = (index: number) =>
        props.computeCustomText?.(entries[index]) ??
        TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

    const highlightIndex = (index: number | undefined) => {
        if (index === undefined) return;

        const value = entries[index].value;

        setHighlightedValue(() => value);
    };

    const openIndex = (index: number) => {
        const value = entries[index].value;

        setHighlightedValue(() => value);
        setOpenValue(() => value);
    };

    const flickTo = (point: Point2d) => {
        const index = MenuUtils.computeFlickIndex({
            layout,
            origin: props.flickOrigin,
            point,
            box: layoutRootRef.current?.getBoundingClientRect(),
            navigable,
        });

        setHighlightedValue(() => (index === undefined ? undefined : entries[index].value));

        return index;
    };

    const hoverIndex = (index: number, point: Point2d) => {
        if (!navigable.includes(index)) return;
        if (!MenuUtils.getIsPointerLed(MenuUtils.getPointerPoint(), point)) return;

        const value = entries[index].value;

        setHighlightedValue(() => value);

        if (props.submenuOpensOn !== "hover") return;

        setOpenValue(() => (MenuUtils.getOpensSubmenu(entries, index, hasBackEntry) ? value : undefined));
    };

    const activateIndex = (index: number) => {
        const activation = MenuUtils.computeActivation<T, MenuItem<T>>(entries, index, hasBackEntry);

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

    const latest = useLatest({ flickTo, activateIndex, onFlickEnd: props.onFlickEnd });

    useEffect(() => {
        if (props.flickOrigin === undefined) return;

        return MenuUtils.observeFlick({
            onMove: (point) => {
                latest.current.flickTo(point);
            },
            onRelease: (point, releasedOn) => {
                const index = latest.current.flickTo(point);

                latest.current.onFlickEnd?.(releasedOn);

                if (index !== undefined) latest.current.activateIndex(index);
            },
            onCancel: () => {
                setHighlightedValue(undefined);
                latest.current.onFlickEnd?.(undefined);
            },
        });
    }, [props.flickOrigin, latest]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!(e.target instanceof HTMLElement) || e.target.id !== props.id) return;

        const query = typeahead.push(e.nativeEvent);

        if (query !== undefined) {
            e.preventDefault();
            highlightIndex(MenuUtils.computeTypeaheadIndex(query, navigable, highlightedIndex, computeItemText));

            return;
        }

        const step = MenuUtils.computeLevelKeyStep(e.key, {
            entries,
            navigable,
            highlightedIndex,
            hasBackEntry,
            isLaidOut,
            depth: props.path.length,
            direction: props.direction,
        });

        if (step === undefined) return;

        e.preventDefault();

        if (step.type === "dismiss") props.onDismiss();
        else if (step.type === "activate") activateIndex(step.index);
        else if (step.type === "open") openIndex(step.index);
        else if (step.type === "highlight") highlightIndex(step.index);
        else if (step.type === "close") {
            if (step.isContained) e.stopPropagation();

            props.onClose();
        }
    };

    const renderEntry = (item: MenuItem<T>, index: number) => {
        const placement = layout?.placements[index];
        const hasSubmenu = MenuUtils.getHasSubmenu(entries, index, hasBackEntry);

        const element = (
            <MenuEntry<T>
                level={props}
                item={item}
                index={index}
                placement={placement}
                isHighlighted={index === highlightedIndex}
                isBack={MenuUtils.getIsBackAt(hasBackEntry, index)}
                hasSubmenu={hasSubmenu}
                isSubmenuOpen={hasSubmenu && openValue === item.value}
                isLaidOut={isLaidOut}
                levelExtent={layout?.extent ?? NO_PARENT_EXTENT}
                rootExtent={rootExtent}
                onActivate={activateIndex}
                onHover={hoverIndex}
                onSubmenuClose={() => setOpenValue(undefined)}
            />
        );

        return placement ? (
            <PlacementItem key={index} placement={placement} stackAt={index + 1}>
                {element}
            </PlacementItem>
        ) : (
            <Fragment key={index}>{element}</Fragment>
        );
    };

    const renderRuns = () =>
        MenuUtils.getRuns<T, MenuItem<T>>(entries).map((run) => {
            const children = run.items.map((item, offset) => renderEntry(item, run.from + offset));

            return run.isRadioGroup ? (
                <div key={run.from} role="group" className={isLaidOut ? MenuStyles.menuLayoutGroup : undefined}>
                    {children}
                </div>
            ) : (
                <Fragment key={run.from}>{children}</Fragment>
            );
        });

    const renderItems = (): ReactNode =>
        layout ? (
            <div
                style={{
                    width: MenuUtils.computeLayoutWidth(props.layoutSize, layout.extent, rootExtent),
                    transform: MenuUtils.computeLayoutShift(layout),
                }}
            >
                <PlacementBox
                    layout={layout}
                    ref={(element) => {
                        layoutRootRef.current = element;
                    }}
                    computeEffect={props.computeEffect}
                >
                    {renderRuns()}
                </PlacementBox>
            </div>
        ) : (
            renderRuns()
        );

    return (
        <Popover
            id={props.id}
            role={"menu"}
            ariaAttributes={{
                "aria-labelledby": props.labelledBy,
                "aria-label": props.ariaLabel,
                "aria-activedescendant": activeItemId,
            }}
            placement={props.placement}
            offset={props.offset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            hasAutoFocus={true}
            isTransparentToPointer={isLaidOut}
            isPinned={isLaidOut}
            isCovered={isCovered}
            isOpen={props.isOpen}
            anchorRef={props.anchorRef}
            anchorRect={props.anchorRect}
            onKeyDown={handleKeyDown}
            onDismiss={() => props.onClose()}
            renderContent={(visibilityTarget, transitionDurationMs, placement) =>
                props.renderPopup(renderItems, visibilityTarget, transitionDurationMs, placement, props.openerFlags)
            }
        />
    );
};

export const Menu = <T,>(props: MenuProps<T>) => {
    const fallbackTriggerId = useId();
    const menuId = useId();

    usePointerPointReader();

    const [triggerElement, setTriggerElement] = useState<HTMLElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const anchorElement = props.anchorRef ?? triggerElement;
    const anchorRef = useLatest(anchorElement ?? null);

    const direction = NavigatorReactUtils.useDirection(anchorRef);

    const [initialHighlightPosition, setInitialHighlightPosition] = useState<MenuHighlightPosition>("first");
    const [flickOrigin, setFlickOrigin] = useState<Point2d>();

    const isTogglePreventedRef = useRef(false);

    const isDisabled = props.isDisabled ?? false;
    const isHoldable = props.opensOnHold ?? false;
    const triggerId = props.id ?? fallbackTriggerId;

    const open = (position: MenuHighlightPosition) => {
        if (isDisabled || isOpen) return;

        setInitialHighlightPosition(position);
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen || !isDisabled) return;

        setIsOpen(false);
    }, [isOpen, isDisabled]);

    const close = () => {
        setIsOpen(false);
        setFlickOrigin(undefined);
    };

    const checkedValues = props.checked?.[0] ?? EMPTY_CHECKED;

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const checkedState = props.checked;

        if (MenuUtils.getIsStateful(item) && checkedState) {
            checkedState[1](MenuUtils.computeNextChecked(checkedState[0], item, radioGroupValues));
        }

        props.onActivate(item.value);

        if (!MenuUtils.getStaysOpenOnPick(item)) close();
    };

    const handleTriggerPress = (e: PointerEvent<HTMLButtonElement>) => {
        if (!isHoldable || e.button !== PRIMARY_BUTTON || isOpen) return;

        isTogglePreventedRef.current = true;

        open("first");
        setFlickOrigin({ x: e.clientX, y: e.clientY });
    };

    const handleTriggerToggle = () => {
        if (isTogglePreventedRef.current) {
            isTogglePreventedRef.current = false;

            return;
        }

        if (isOpen) close();
        else open("first");
    };

    useEffect(() => {
        if (isOpen) return;

        setInitialHighlightPosition("first");
    }, [isOpen]);

    const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        const position = MenuUtils.getTriggerOpenPosition(e.key);

        if (position === undefined) return;

        e.preventDefault();

        open(position);
    };

    return (
        <InteractionWrapper<MenuFlags>
            {...props}
            extraFlags={{ isOpen }}
            ref={(element) => {
                setTriggerElement(element ?? undefined);
                props.ref?.(element);
            }}
            renderControl={(setElementRef, flags) => (
                <>
                    <MenuTrigger
                        ref={setElementRef}
                        id={triggerId}
                        ariaLabel={props.ariaLabel}
                        menuId={menuId}
                        role={props.triggerRole ?? MENU_DEFAULTS.triggerRole}
                        flags={flags}
                        renderContent={props.renderContent}
                        isHoldable={isHoldable}
                        onToggle={handleTriggerToggle}
                        onPress={handleTriggerPress}
                        onKeyDown={handleTriggerKeyDown}
                    />

                    <MenuLevel<T>
                        id={menuId}
                        labelledBy={triggerId}
                        items={props.items}
                        isOpen={isOpen}
                        direction={direction}
                        path={ROOT_PATH}
                        parentExtent={NO_PARENT_EXTENT}
                        rootExtent={NO_PARENT_EXTENT}
                        layoutSize={props.layoutSize}
                        initialHighlightPosition={initialHighlightPosition}
                        anchorRef={anchorElement}
                        placement={props.placement}
                        offset={props.offset}
                        submenuPlacement={props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction]}
                        submenuOffset={props.submenuOffset}
                        submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
                        submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        openerFlags={flags}
                        checkedValues={checkedValues}
                        computeLayout={props.computeLayout}
                        computeEffect={props.computeEffect}
                        computeCustomText={props.computeCustomText}
                        flickOrigin={flickOrigin}
                        renderItem={props.renderItem}
                        renderPopup={props.renderPopup}
                        onPick={pick}
                        onFlickEnd={(releasedOn) => {
                            setFlickOrigin(undefined);

                            if (!releasedOn || !triggerElement?.contains(releasedOn)) {
                                isTogglePreventedRef.current = false;
                            }
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
    const menuId = useId();

    usePointerPointReader();

    const regionRef = useRef<HTMLDivElement | null>(null);
    const regionElement = useElement(regionRef);

    const [anchorRect, setAnchorRect] = useState<Rect>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const direction = NavigatorReactUtils.useDirection(regionRef);

    const isDisabled = props.isDisabled ?? false;

    const latest = useLatest({ isDisabled, viewportContext, setIsOpen });

    const close = () => {
        setIsOpen(false);
    };

    const checkedValues = props.checked?.[0] ?? EMPTY_CHECKED;

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const checkedState = props.checked;

        if (MenuUtils.getIsStateful(item) && checkedState) {
            checkedState[1](MenuUtils.computeNextChecked(checkedState[0], item, radioGroupValues));
        }

        props.onActivate(item.value);

        if (!MenuUtils.getStaysOpenOnPick(item)) close();
    };

    useEffect(() => {
        if (!isOpen || !isDisabled) return;

        setIsOpen(false);
    }, [isOpen, isDisabled]);

    useEffect(() => {
        if (!regionElement) return;

        return MenuUtils.observeContextMenuRequests(regionElement, {
            get viewportContext() {
                return latest.current.viewportContext;
            },
            getIsDisabled: () => latest.current.isDisabled,
            onRequest: (rect) => {
                setAnchorRect((previous) => (previous && Rect.isSame(previous, rect) ? previous : rect));
                latest.current.setIsOpen(true);
            },
        });
    }, [regionElement, latest]);

    return (
        <>
            <div
                ref={regionRef}
                className={MenuStyles.contextMenuRegion}
                role="group"
                tabIndex={isDisabled ? -1 : 0}
                aria-label={props.regionAriaLabel}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? menuId : undefined}
                aria-disabled={isDisabled || undefined}
            >
                {props.renderRegion()}
            </div>

            <MenuLevel<T>
                id={menuId}
                ariaLabel={props.ariaLabel}
                items={props.items}
                isOpen={isOpen}
                direction={direction}
                path={ROOT_PATH}
                parentExtent={NO_PARENT_EXTENT}
                rootExtent={NO_PARENT_EXTENT}
                anchorRef={regionElement}
                anchorRect={anchorRect}
                placement={props.placement}
                offset={props.offset}
                submenuPlacement={props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction]}
                submenuOffset={props.submenuOffset}
                submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
                submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
                reservedScreenSize={props.reservedScreenSize}
                transitionDurationMs={props.transitionDurationMs}
                openerFlags={{ isOpen }}
                checkedValues={checkedValues}
                computeLayout={props.computeLayout}
                computeEffect={props.computeEffect}
                computeCustomText={props.computeCustomText}
                renderItem={props.renderItem}
                renderPopup={props.renderPopup}
                onPick={pick}
                onClose={close}
                onDismiss={close}
            />
        </>
    );
};
