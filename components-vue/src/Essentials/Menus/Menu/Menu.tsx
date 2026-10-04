import { type SlotsType, type VNodeChild, computed, defineComponent, shallowRef, useId, watch } from "vue";

import {
    FloaterStyles,
    MENU_DEFAULTS,
    type MenuFlags,
    type MenuHighlightPosition,
    type MenuItemFlags,
    MenuStyles,
    MenuUtils,
    TypeaheadUtils,
} from "@thewaver/ss-components";
import { type Point2d, Rect } from "@thewaver/ss-utils";

import { FloaterVueUtils } from "../../../Abstracts/Floater/FloaterVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { TypeaheadVueUtils } from "../../../Abstracts/Typeahead/TypeaheadVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { LabelVueUtils } from "../../Input/Label/LabelVue.utils";
import type {
    ContextMenuProps,
    ContextMenuSlots,
    MenuEntryProps,
    MenuItem,
    MenuItemViewProps,
    MenuItemsSlots,
    MenuLevelProps,
    MenuProps,
    MenuSlots,
    MenuTriggerProps,
} from "./Menu.types";

const EMPTY_CHECKED: never[] = [];

const ROOT_PATH: number[] = [];
const NO_PARENT_EXTENT = 0;
const PRIMARY_BUTTON = 0;

const usePointerPointReader = () => {
    watchAfterRender([], () => MenuUtils.observePointerPoint());
};

const MenuTrigger = defineComponent(
    (props: MenuTriggerProps, { slots }: SlotsContext<InteractionControlSlots<MenuFlags>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;
            const isOpen = props.flags.isOpen;

            return (
                <button
                    id={props.id}
                    type="button"
                    class={[MenuStyles.menuTrigger, props.isHoldable && MenuStyles.menuTriggerHoldable]}
                    role={props.role}
                    aria-haspopup="menu"
                    aria-label={ariaLabel.value}
                    aria-disabled={isDisabled || undefined}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? props.menuId : undefined}
                    onPointerdown={(e) => {
                        if (isDisabled) return;

                        props.onPress(e);
                    }}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onToggle();
                    }}
                    onKeydown={(e) => props.onKeyDown(e)}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        };
    },
    {
        name: "MenuTrigger",
        props: declareProps<MenuTriggerProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            menuId: null,
            role: null,
            isHoldable: Boolean,
            onToggle: null,
            onPress: null,
            onKeyDown: null,
        }),
    },
);

const MenuItemView = defineComponent(
    (props: MenuItemViewProps, { slots }: SlotsContext<InteractionControlSlots<MenuItemFlags>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;
            const hasSubmenu = props.flags.hasSubmenu;
            const isOpen = props.flags.isOpen;

            return (
                <div
                    id={props.id}
                    class={[MenuStyles.menuItem, props.isRegion && MenuStyles.menuItemRegion]}
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
                    onMouseenter={(e) => props.onHover({ x: e.clientX, y: e.clientY })}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </div>
            );
        },
    {
        name: "MenuItemView",
        props: declareProps<MenuItemViewProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            kind: null,
            submenuId: null,
            isRegion: Boolean,
            onActivate: null,
            onHover: null,
        }),
    },
);

const MenuEntry = defineComponent(
    <T,>(props: MenuEntryProps<T>, { slots }: SlotsContext<MenuItemsSlots<T>>) => {
        const itemElement = shallowRef<HTMLElement>();

        const getItemId = () => `${props.level.id}-item-${props.index}`;
        const getSubmenuId = () => `${props.level.id}-submenu-${props.index}`;

        const path = computed(() => [...props.level.path, props.index]);

        watchAfterRender([itemElement], ([element]) =>
            element ? props.onRegister?.(props.index, element) : undefined,
        );

        watchAfterRender([() => props.isHighlighted, itemElement], ([isHighlighted, element]) => {
            if (!isHighlighted || !element) return;

            MenuUtils.revealItem(element);
        });

        return () => {
            const level = props.level;
            const item = props.item;
            const index = props.index;
            const placement = props.placement;
            const isLaidOut = props.isLaidOut;
            const itemId = getItemId();
            const submenuId = getSubmenuId();

            const extraFlags: MenuItemFlags = {
                isHighlighted: props.isHighlighted,
                hasSubmenu: props.hasSubmenu,
                isBack: props.isBack,
                isOpen: props.isSubmenuOpen,
                isChecked: level.checkedValues.includes(item.value),
            };

            return (
                <InteractionWrapper
                    ref={(target) => {
                        itemElement.value = toElement(target);
                    }}
                    sizing={"fill"}
                    isDisabled={item.isDisabled ?? false}
                    isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                    isTabbable={false}
                    tooltipDefs={item.tooltipDefs}
                    extraFlags={extraFlags}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => [
                                <MenuItemView
                                    ref={setElementRef}
                                    kind={MenuUtils.getKind(item)}
                                    id={itemId}
                                    ariaLabel={item.ariaLabel ?? ""}
                                    submenuId={submenuId}
                                    flags={flags}
                                    isRegion={placement?.sector !== undefined}
                                    onActivate={() => props.onActivate(index)}
                                    onHover={(point) => props.onHover(index, point)}
                                >
                                    {
                                        {
                                            renderContent: (itemFlags) =>
                                                callSlot(slots.renderItem, { item, flags: itemFlags, placement }),
                                        } satisfies InteractionControlSlots<MenuItemFlags>
                                    }
                                </MenuItemView>,

                                props.hasSubmenu && (
                                    <MenuLevel
                                        id={submenuId}
                                        labelledBy={itemId}
                                        items={item.items!}
                                        isOpen={props.isSubmenuOpen}
                                        direction={level.direction}
                                        path={path.value}
                                        parentExtent={props.levelExtent}
                                        rootExtent={props.rootExtent}
                                        layoutSize={level.layoutSize}
                                        parentPlacement={placement}
                                        anchorRef={isLaidOut ? level.anchorRef : itemElement.value}
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
                                        floaterTransitionDurationMs={level.floaterTransitionDurationMs}
                                        openerFlags={flags}
                                        checkedValues={level.checkedValues}
                                        computeLayout={level.computeLayout}
                                        computeEffect={level.computeEffect}
                                        computeCustomText={level.computeCustomText}
                                        onPick={level.onPick}
                                        onClose={props.onSubmenuClose}
                                        onDismiss={level.onDismiss}
                                    >
                                        {{
                                            renderItem: slots.renderItem,
                                            renderPopup: slots.renderPopup,
                                            renderHighlightFloater: slots.renderHighlightFloater,
                                        }}
                                    </MenuLevel>
                                ),
                            ],
                        } satisfies Partial<InteractionWrapperSlots<MenuItemFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "MenuEntry",
        slots: Object as SlotsType<MenuItemsSlots<any>>,
        props: declareProps<MenuEntryProps<unknown>>({
            level: null,
            item: null,
            index: null,
            placement: null,
            isHighlighted: Boolean,
            isBack: Boolean,
            hasSubmenu: Boolean,
            isSubmenuOpen: Boolean,
            isLaidOut: Boolean,
            levelExtent: null,
            rootExtent: null,
            onActivate: null,
            onHover: null,
            onSubmenuClose: null,
            onRegister: null,
        }),
    },
);

const MenuLevel = defineComponent(
    <T,>(props: MenuLevelProps<T>, { slots }: SlotsContext<MenuItemsSlots<T>>) => {
        const highlightedValue = shallowRef<T>();
        const openValue = shallowRef<T>();
        const isCoveredWhileClosing = shallowRef(false);
        const layoutRootRef = shallowRef<HTMLElement>();

        const typeahead = TypeaheadVueUtils.useBuffer();

        const hasBackEntry = computed(() =>
            MenuUtils.getHasBackEntry(props.submenuMode, props.openerItem !== undefined),
        );

        const isCovered = computed(
            () => props.submenuMode === "replace" && (openValue.value !== undefined || isCoveredWhileClosing.value),
        );

        watch(
            () => props.isOpen,
            (isOpen) => {
                if (isOpen) {
                    isCoveredWhileClosing.value = false;
                } else {
                    isCoveredWhileClosing.value = isCovered.value;
                    highlightedValue.value = undefined;
                    openValue.value = undefined;
                }
            },
        );

        const entries = computed(() => MenuUtils.computeEntries(props.items, props.openerItem, props.submenuMode));

        const navigable = computed(() => MenuUtils.computeNavigableIndexes(entries.value));

        const highlightedIndex = computed(() =>
            MenuUtils.computeHighlightedIndex({
                isOpen: props.isOpen,
                entries: entries.value,
                navigable: navigable.value,
                highlightedValue: highlightedValue.value,
                initialHighlightPosition: props.initialHighlightPosition,
                hasBackEntry: hasBackEntry.value,
            }),
        );

        const itemCount = computed(() => entries.value.length);

        const layout = computed(() =>
            props.computeLayout?.({
                itemCount: itemCount.value,
                path: props.path,
                parentExtent: props.parentExtent,
                parentPlacement: props.parentPlacement,
            }),
        );

        const rootExtent = computed(() => MenuUtils.computeRootExtent(props.rootExtent, layout.value));

        const itemsRef = shallowRef<HTMLElement>();
        const itemRefsVersion = shallowRef(0);

        const itemRefs = new Map<number, HTMLElement>();

        const registerItem = (index: number, element: HTMLElement) => {
            itemRefs.set(index, element);
            itemRefsVersion.value += 1;

            return () => {
                if (itemRefs.get(index) !== element) return;

                itemRefs.delete(index);
                itemRefsVersion.value += 1;
            };
        };

        const getFloaterTransitionDurationMs = () =>
            props.floaterTransitionDurationMs ?? MENU_DEFAULTS.floaterTransitionDurationMs;

        const highlightFloater = FloaterVueUtils.useFloater({
            isEnabled: () => slots.renderHighlightFloater !== undefined,
            container: itemsRef,
            target: () => {
                const index = highlightedIndex.value;

                void itemRefsVersion.value;

                return index === undefined ? undefined : itemRefs.get(index);
            },
            layout,
            placement: () => {
                const index = highlightedIndex.value;

                return index === undefined ? undefined : layout.value?.placements[index];
            },
            transitionDurationMs: getFloaterTransitionDurationMs,
        });

        const renderHighlightFloater = () => {
            const floaterTransitionDurationMs = getFloaterTransitionDurationMs();

            return (
                highlightFloater.isRendered.value && (
                    <div
                        ref={highlightFloater.setRef}
                        class={FloaterStyles.floater}
                        style={{
                            ...highlightFloater.bounds.value,
                            transitionDuration: `${floaterTransitionDurationMs}ms`,
                        }}
                    >
                        {callSlot(slots.renderHighlightFloater, {
                            visibilityTarget: highlightFloater.visibilityTarget.value,
                            transitionDurationMs: floaterTransitionDurationMs,
                        })}
                    </div>
                )
            );
        };

        const getItemId = (index: number) => `${props.id}-item-${index}`;

        const computeItemText = (index: number) =>
            props.computeCustomText?.(entries.value[index]) ??
            TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

        const highlightIndex = (index: number | undefined) => {
            if (index === undefined) return;

            highlightedValue.value = entries.value[index].value;
        };

        const openIndex = (index: number) => {
            const value = entries.value[index].value;

            highlightedValue.value = value;
            openValue.value = value;
        };

        const flickTo = (point: Point2d) => {
            const index = MenuUtils.computeFlickIndex({
                layout: layout.value,
                origin: props.flickOrigin,
                point,
                box: layoutRootRef.value?.getBoundingClientRect(),
                navigable: navigable.value,
            });

            highlightedValue.value = index === undefined ? undefined : entries.value[index].value;

            return index;
        };

        const hoverIndex = (index: number, point: Point2d) => {
            if (!navigable.value.includes(index)) return;
            if (!MenuUtils.getIsPointerLed(MenuUtils.getPointerPoint(), point)) return;

            const value = entries.value[index].value;

            highlightedValue.value = value;

            if (props.submenuOpensOn !== "hover") return;

            openValue.value = MenuUtils.getOpensSubmenu(entries.value, index, hasBackEntry.value) ? value : undefined;
        };

        const activateIndex = (index: number) => {
            const activation = MenuUtils.computeActivation<T, MenuItem<T>>(entries.value, index, hasBackEntry.value);

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

        watchAfterRender([() => props.flickOrigin], ([flickOrigin]) => {
            if (flickOrigin === undefined) return;

            return MenuUtils.observeFlick({
                onMove: (point) => {
                    flickTo(point);
                },
                onRelease: (point, releasedOn) => {
                    const index = flickTo(point);

                    props.onFlickEnd?.(releasedOn);

                    if (index !== undefined) activateIndex(index);
                },
                onCancel: () => {
                    highlightedValue.value = undefined;
                    props.onFlickEnd?.(undefined);
                },
            });
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!(e.target instanceof HTMLElement) || e.target.id !== props.id) return;

            const query = typeahead.push(e);

            if (query !== undefined) {
                e.preventDefault();
                highlightIndex(
                    MenuUtils.computeTypeaheadIndex(query, navigable.value, highlightedIndex.value, computeItemText),
                );

                return;
            }

            const step = MenuUtils.computeLevelKeyStep(e.key, {
                entries: entries.value,
                navigable: navigable.value,
                highlightedIndex: highlightedIndex.value,
                hasBackEntry: hasBackEntry.value,
                isLaidOut: layout.value !== undefined,
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
            const currentLayout = layout.value;
            const placement = currentLayout?.placements[index];
            const hasSubmenu = MenuUtils.getHasSubmenu(entries.value, index, hasBackEntry.value);

            const element = (
                <MenuEntry
                    key={index}
                    level={props}
                    item={item}
                    index={index}
                    placement={placement}
                    isHighlighted={index === highlightedIndex.value}
                    isBack={MenuUtils.getIsBackAt(hasBackEntry.value, index)}
                    hasSubmenu={hasSubmenu}
                    isSubmenuOpen={hasSubmenu && openValue.value === item.value}
                    isLaidOut={currentLayout !== undefined}
                    levelExtent={currentLayout?.extent ?? NO_PARENT_EXTENT}
                    rootExtent={rootExtent.value}
                    onActivate={activateIndex}
                    onHover={hoverIndex}
                    onSubmenuClose={() => {
                        openValue.value = undefined;
                    }}
                    onRegister={registerItem}
                >
                    {{
                        renderItem: slots.renderItem,
                        renderPopup: slots.renderPopup,
                        renderHighlightFloater: slots.renderHighlightFloater,
                    }}
                </MenuEntry>
            );

            return placement ? (
                <PlacementItem key={index} placement={placement} stackAt={index + 1}>
                    {{ default: () => element }}
                </PlacementItem>
            ) : (
                element
            );
        };

        const renderRuns = () =>
            MenuUtils.getRuns<T, MenuItem<T>>(entries.value).flatMap((run) => {
                const children = run.items.map((item, offset) => renderEntry(item, run.from + offset));

                return run.isRadioGroup
                    ? [
                          <div
                              key={`group-${run.from}`}
                              role="group"
                              class={layout.value !== undefined ? MenuStyles.menuLayoutGroup : undefined}
                          >
                              {children}
                          </div>,
                      ]
                    : children;
            });

        const renderItems = (): VNodeChild => {
            const currentLayout = layout.value;

            if (!currentLayout) {
                return (
                    <div
                        ref={(target) => {
                            itemsRef.value = toElement(target);
                        }}
                        class={MenuStyles.menuItems}
                        role="presentation"
                    >
                        {renderHighlightFloater()}
                        {renderRuns()}
                    </div>
                );
            }

            return (
                <div
                    style={{
                        width: MenuUtils.computeLayoutWidth(props.layoutSize, currentLayout.extent, rootExtent.value),
                        transform: MenuUtils.computeLayoutShift(currentLayout),
                    }}
                >
                    <PlacementBox
                        layout={currentLayout}
                        ref={(target) => {
                            layoutRootRef.value = toElement(target);
                        }}
                        computeEffect={props.computeEffect}
                    >
                        {{ default: () => [renderHighlightFloater(), ...renderRuns()] }}
                    </PlacementBox>
                </div>
            );
        };

        return () => {
            const isLaidOut = layout.value !== undefined;
            const activeItemId = highlightedIndex.value === undefined ? undefined : getItemId(highlightedIndex.value);

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
                    isCovered={isCovered.value}
                    isOpen={props.isOpen}
                    anchorRef={props.anchorRef}
                    anchorRect={props.anchorRect}
                    onKeyDown={handleKeyDown}
                    onDismiss={() => props.onClose()}
                >
                    {
                        {
                            renderContent: ({ visibilityTarget, transitionDurationMs, placement }) =>
                                callSlot(slots.renderPopup, {
                                    renderItems,
                                    visibilityTarget,
                                    transitionDurationMs,
                                    placement,
                                    flags: props.openerFlags,
                                }),
                        } satisfies PopoverSlots
                    }
                </Popover>
            );
        };
    },
    {
        name: "MenuLevel",
        slots: Object as SlotsType<MenuItemsSlots<any>>,
        props: declareProps<MenuLevelProps<unknown>>({
            id: null,
            labelledBy: null,
            ariaLabel: null,
            isOpen: Boolean,
            direction: null,
            path: null,
            parentExtent: null,
            rootExtent: null,
            layoutSize: null,
            initialHighlightPosition: null,
            anchorRef: null,
            anchorRect: null,
            placement: null,
            offset: null,
            submenuPlacement: null,
            submenuOffset: null,
            submenuMode: null,
            submenuOpensOn: null,
            reservedScreenSize: null,
            transitionDurationMs: null,
            floaterTransitionDurationMs: null,
            openerFlags: null,
            parentPlacement: null,
            openerItem: null,
            items: null,
            checkedValues: null,
            computeLayout: null,
            computeEffect: null,
            computeCustomText: null,
            flickOrigin: null,
            onPick: null,
            onFlickEnd: null,
            onClose: null,
            onDismiss: null,
        }),
    },
);

export const Menu = defineComponent(
    <T,>(props: MenuProps<T>, { slots, expose }: SlotsContext<MenuSlots<T>>) => {
        const fallbackTriggerId = useId();
        const menuId = useId();

        usePointerPointReader();

        const triggerElement = shallowRef<HTMLElement>();
        const initialHighlightPosition = shallowRef<MenuHighlightPosition>("first");
        const flickOrigin = shallowRef<Point2d>();

        const isOpen = useTwoWay(props, "visibility", false);
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        let isTogglePrevented = false;

        exposeElement(expose, () => triggerElement.value);

        const getAnchorElement = () => props.anchorRef ?? triggerElement.value;
        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsHoldable = () => props.opensOnHold ?? false;

        const direction = NavigatorVueUtils.useDirection(getAnchorElement);

        const open = (position: MenuHighlightPosition) => {
            if (getIsDisabled() || isOpen.value) return;

            initialHighlightPosition.value = position;
            isOpen.value = true;
        };

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isDisabled]) => {
            if (!isShown || !isDisabled) return;

            isOpen.value = false;
        });

        const close = () => {
            isOpen.value = false;
            flickOrigin.value = undefined;
        };

        const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
            if (MenuUtils.getIsStateful(item) && props.checked !== undefined) {
                checked.value = MenuUtils.computeNextChecked(checked.value ?? EMPTY_CHECKED, item, radioGroupValues);
            }

            props.onActivate(item.value);

            if (!MenuUtils.getStaysOpenOnPick(item)) close();
        };

        const handleTriggerPress = (e: PointerEvent) => {
            if (!getIsHoldable() || e.button !== PRIMARY_BUTTON || isOpen.value) return;

            isTogglePrevented = true;

            open("first");
            flickOrigin.value = { x: e.clientX, y: e.clientY };
        };

        const handleTriggerToggle = () => {
            if (isTogglePrevented) {
                isTogglePrevented = false;

                return;
            }

            if (isOpen.value) close();
            else open("first");
        };

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown) return;

            initialHighlightPosition.value = "first";
        });

        const handleTriggerKeyDown = (e: KeyboardEvent) => {
            if (getIsDisabled()) return;

            const position = MenuUtils.getTriggerOpenPosition(e.key);

            if (position === undefined) return;

            e.preventDefault();

            open(position);
        };

        return () => {
            const triggerId = props.id ?? fallbackTriggerId;

            return (
                <InteractionWrapper
                    {...forwardProps(props, InteractionWrapper)}
                    extraFlags={{ isOpen: isOpen.value }}
                    ref={(target) => {
                        triggerElement.value = toElement(target);
                    }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => [
                                <MenuTrigger
                                    ref={setElementRef}
                                    id={triggerId}
                                    ariaLabel={props.ariaLabel}
                                    menuId={menuId}
                                    role={props.triggerRole ?? MENU_DEFAULTS.triggerRole}
                                    flags={flags}
                                    isHoldable={getIsHoldable()}
                                    onToggle={handleTriggerToggle}
                                    onPress={handleTriggerPress}
                                    onKeyDown={handleTriggerKeyDown}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </MenuTrigger>,

                                <MenuLevel
                                    id={menuId}
                                    labelledBy={triggerId}
                                    items={props.items}
                                    isOpen={isOpen.value}
                                    direction={direction.value}
                                    path={ROOT_PATH}
                                    parentExtent={NO_PARENT_EXTENT}
                                    rootExtent={NO_PARENT_EXTENT}
                                    layoutSize={props.layoutSize}
                                    initialHighlightPosition={initialHighlightPosition.value}
                                    anchorRef={getAnchorElement()}
                                    placement={props.placement}
                                    offset={props.offset}
                                    submenuPlacement={
                                        props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction.value]
                                    }
                                    submenuOffset={props.submenuOffset}
                                    submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
                                    submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
                                    reservedScreenSize={props.reservedScreenSize}
                                    transitionDurationMs={props.transitionDurationMs}
                                    floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                                    openerFlags={flags}
                                    checkedValues={checked.value ?? EMPTY_CHECKED}
                                    computeLayout={props.computeLayout}
                                    computeEffect={props.computeEffect}
                                    computeCustomText={props.computeCustomText}
                                    flickOrigin={flickOrigin.value}
                                    onPick={pick}
                                    onFlickEnd={(releasedOn) => {
                                        flickOrigin.value = undefined;

                                        if (!releasedOn || !triggerElement.value?.contains(releasedOn)) {
                                            isTogglePrevented = false;
                                        }
                                    }}
                                    onClose={close}
                                    onDismiss={close}
                                >
                                    {{
                                        renderItem: slots.renderItem,
                                        renderPopup: slots.renderPopup,
                                        renderHighlightFloater: slots.renderHighlightFloater,
                                    }}
                                </MenuLevel>,
                            ],
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<MenuFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "Menu",
        slots: Object as SlotsType<MenuSlots<any>>,
        props: declareProps<MenuProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "layoutSize": null,
            "id": null,
            "ariaLabel": null,
            "placement": null,
            "offset": null,
            "submenuPlacement": null,
            "submenuOffset": null,
            "submenuMode": null,
            "submenuOpensOn": null,
            "opensOnHold": Boolean,
            "triggerRole": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "floaterTransitionDurationMs": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "anchorRef": null,
            "items": null,
            "checked": null,
            "onUpdate:checked": null,
            "computeLayout": null,
            "computeEffect": null,
            "computeCustomText": null,
            "onActivate": null,
        }),
    },
);

export const ContextMenu = defineComponent(
    <T,>(props: ContextMenuProps<T>, { slots }: SlotsContext<ContextMenuSlots<T>>) => {
        const viewportContext = useViewportContext();
        const menuId = useId();

        usePointerPointReader();

        const regionRef = shallowRef<HTMLDivElement>();
        const anchorRect = shallowRef<Rect>();

        const isOpen = useTwoWay(props, "visibility", false);
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        const direction = NavigatorVueUtils.useDirection(regionRef);

        const getIsDisabled = () => props.isDisabled ?? false;

        const close = () => {
            isOpen.value = false;
        };

        const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
            if (MenuUtils.getIsStateful(item) && props.checked !== undefined) {
                checked.value = MenuUtils.computeNextChecked(checked.value ?? EMPTY_CHECKED, item, radioGroupValues);
            }

            props.onActivate(item.value);

            if (!MenuUtils.getStaysOpenOnPick(item)) close();
        };

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isDisabled]) => {
            if (!isShown || !isDisabled) return;

            isOpen.value = false;
        });

        watchAfterRender([regionRef], ([region]) => {
            if (!region) return;

            return MenuUtils.observeContextMenuRequests(region, {
                viewportContext,
                getIsDisabled,
                onRequest: (rect) => {
                    const previous = anchorRect.value;

                    anchorRect.value = previous && Rect.isSame(previous, rect) ? previous : rect;
                    isOpen.value = true;
                },
            });
        });

        return () => {
            const isDisabled = getIsDisabled();

            return (
                <>
                    <div
                        ref={regionRef}
                        class={MenuStyles.contextMenuRegion}
                        role="group"
                        tabindex={isDisabled ? -1 : 0}
                        aria-label={props.regionAriaLabel}
                        aria-haspopup="menu"
                        aria-expanded={isOpen.value}
                        aria-controls={isOpen.value ? menuId : undefined}
                        aria-disabled={isDisabled || undefined}
                    >
                        {slots.renderRegion?.()}
                    </div>

                    <MenuLevel
                        id={menuId}
                        ariaLabel={props.ariaLabel}
                        items={props.items}
                        isOpen={isOpen.value}
                        direction={direction.value}
                        path={ROOT_PATH}
                        parentExtent={NO_PARENT_EXTENT}
                        rootExtent={NO_PARENT_EXTENT}
                        anchorRef={regionRef.value}
                        anchorRect={anchorRect.value}
                        placement={props.placement}
                        offset={props.offset}
                        submenuPlacement={props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction.value]}
                        submenuOffset={props.submenuOffset}
                        submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
                        submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
                        reservedScreenSize={props.reservedScreenSize}
                        transitionDurationMs={props.transitionDurationMs}
                        floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                        openerFlags={{ isOpen: isOpen.value }}
                        checkedValues={checked.value ?? EMPTY_CHECKED}
                        computeLayout={props.computeLayout}
                        computeEffect={props.computeEffect}
                        computeCustomText={props.computeCustomText}
                        onPick={pick}
                        onClose={close}
                        onDismiss={close}
                    >
                        {{
                            renderItem: slots.renderItem,
                            renderPopup: slots.renderPopup,
                            renderHighlightFloater: slots.renderHighlightFloater,
                        }}
                    </MenuLevel>
                </>
            );
        };
    },
    {
        name: "ContextMenu",
        slots: Object as SlotsType<ContextMenuSlots<any>>,
        props: declareProps<ContextMenuProps<unknown>>({
            "ariaLabel": null,
            "regionAriaLabel": null,
            "isDisabled": Boolean,
            "placement": null,
            "offset": null,
            "submenuPlacement": null,
            "submenuOffset": null,
            "submenuMode": null,
            "submenuOpensOn": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "floaterTransitionDurationMs": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "items": null,
            "checked": null,
            "onUpdate:checked": null,
            "computeLayout": null,
            "computeEffect": null,
            "computeCustomText": null,
            "onActivate": null,
        }),
    },
);
