import { type ComponentPublicInstance, type SlotsType, computed, defineComponent, nextTick, shallowRef } from "vue";

import {
    DismisserUtils,
    type InteractionSizing,
    type MenuItemKind,
    type MenuTriggerRole,
    MenuUtils,
    TOOLBAR_DEFAULTS,
    type ToolbarAction,
    ToolbarStyles,
    ToolbarUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { Menu } from "../Menus/Menu/Menu";
import type { MenuItem, MenuSlots } from "../Menus/Menu/Menu.types";
import type {
    ToolbarButtonsSlots,
    ToolbarCompositeProps,
    ToolbarCompositeSlots,
    ToolbarMenusProps,
    ToolbarMenusSlots,
    ToolbarProps,
    ToolbarSlots,
} from "./Toolbar.types";

const OVERFLOW_STOP = ToolbarUtils.OVERFLOW_STOP;
const NO_RADIO_GROUP: never[] = [];
const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";
const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
const WORD_ROLE: MenuTriggerRole = "menuitem";

export const ToolbarComposite = defineComponent(
    <T,>(props: ToolbarCompositeProps<T>, { slots }: SlotsContext<ToolbarCompositeSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const overflowRef = shallowRef<HTMLElement>();

        const itemElements = shallowRef<(HTMLElement | undefined)[]>([]);
        const focusedStop = shallowRef<number>();
        const openStop = shallowRef<number>();
        const switchStop = shallowRef<number>();

        const pressedValues = useTwoWay(props, "pressedValues", undefined, { keepsOwnValue: false });
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        const buttonSlots = slots as Partial<ToolbarButtonsSlots<T>>;
        const menuSlots = slots as Partial<ToolbarMenusSlots<T>>;

        const getIsMenubar = () => props.role === "menubar";
        const getGap = () => props.gap ?? TOOLBAR_DEFAULTS.gap;
        const getPressedValues = () => (props.role === "toolbar" ? pressedValues.value : undefined);

        const actionCount = computed(() => props.actions.length);
        const layout = computed(() => props.computeLayout?.({ itemCount: actionCount.value }));

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);
        const itemSizes = ElementObserverVueUtils.useBorderBoxSizes(itemElements);
        const overflowSize = ElementObserverVueUtils.useBorderBoxSize(overflowRef);

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const cut = computed(() =>
            layout.value !== undefined
                ? ToolbarUtils.computeUncut(props.actions.length)
                : ToolbarUtils.computeCut({
                      widths: itemSizes.value.map((size) => size.width),
                      collapses: props.actions.map((action: ToolbarAction<T>) => action.collapse ?? "auto"),
                      available: rootSize.value.width,
                      overflowWidth: overflowSize.value.width,
                      gap: getGap(),
                  }),
        );

        const overflowItems = computed(
            () =>
                ToolbarUtils.computeOverflowItems<T, MenuItem<T>>(props.actions, cut.value.collapsedIndexes, {
                    hasSubmenus: getIsMenubar(),
                    isPressable: getPressedValues() !== undefined,
                }) as MenuItem<T>[],
        );

        const hasOverflow = computed(() => overflowItems.value.length > 0);

        const stops = computed(() => ToolbarUtils.computeStops(props.actions, cut.value.shownIndexes));

        const rovingStop = computed(() =>
            ToolbarUtils.computeRovingStop(stops.value, focusedStop.value, hasOverflow.value),
        );

        const setItemRef = (index: number, target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (itemElements.value[index] === element) return;

            const next = [...itemElements.value];

            next[index] = element;
            itemElements.value = next;
        };

        const focusStop = (stop: number) => {
            focusedStop.value = stop;

            if (stop === OVERFLOW_STOP) overflowRef.value?.focus();
            else itemElements.value[stop]?.focus();
        };

        const setStopOpen = (stop: number, isOpen: boolean) => {
            openStop.value = ToolbarUtils.computeNextOpenStop(openStop.value, stop, isOpen);
        };

        watchAfterRender([stops, focusedStop, hasOverflow], ([stopList, focused, isOverflowing]) => {
            const step = ToolbarUtils.computeFocusLanding(stopList, focused, isOverflowing);

            if (focused === undefined || step === undefined) return;

            const hadFocus = itemElements.value[focused]?.contains(document.activeElement);

            focusedStop.value = step.landing;

            if (!hadFocus || step.landing === undefined) return;

            focusStop(step.landing);
        });

        watchAfterRender([openStop, stops, hasOverflow], ([open, stopList, isOverflowing]) => {
            if (open === undefined) return;
            if (ToolbarUtils.getIsStopPresent(open, stopList, isOverflowing)) return;

            openStop.value = undefined;
        });

        watchAfterRender([switchStop], ([stop]) => {
            if (stop === undefined) return;

            switchStop.value = undefined;

            void nextTick(() => {
                focusStop(stop);
                openStop.value = stop;
            });
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.defaultPrevented) return;

            const step = ToolbarUtils.computeKeyStep(e.key, {
                isFromRow: e.target instanceof Node && (rootRef.value?.contains(e.target) ?? false),
                stops: stops.value,
                hasOverflow: hasOverflow.value,
                openStop: getIsMenubar() ? openStop.value : undefined,
                rovingStop: rovingStop.value,
                isPlaced: layout.value !== undefined,
                direction: direction.value,
            });

            if (step === undefined) return;

            e.preventDefault();

            if (!step.isSwitch) {
                focusStop(step.stop);

                return;
            }

            openStop.value = undefined;
            switchStop.value = step.stop;
        };

        watchAfterRender([() => getIsMenubar() && openStop.value !== undefined], ([isMenuOpen]) => {
            if (!isMenuOpen) return;

            const handleMenuKeyDown = (e: KeyboardEvent) => {
                const root = rootRef.value;

                if (!root || !(e.target instanceof Node) || root.contains(e.target)) return;
                if (!DismisserUtils.getIsWithinOwnedLayer(e.target, [root])) return;

                handleKeyDown(e);
            };

            document.addEventListener("keydown", handleMenuKeyDown);

            return () => document.removeEventListener("keydown", handleMenuKeyDown);
        });

        const pressAction = (value: T) => {
            if (props.role === "toolbar" && props.pressedValues !== undefined) {
                pressedValues.value = MenuUtils.computeNextChecked(
                    pressedValues.value ?? NO_RADIO_GROUP,
                    { value, kind: PRESSED_ITEM_KIND },
                    NO_RADIO_GROUP,
                );
            }

            props.onActivate(value);
        };

        const getSizingAt = (index: number) =>
            layout.value?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING;

        const getCheckedProps = () => ({
            "checked": checked.value,
            "onUpdate:checked": (value: T[]) => {
                checked.value = value;
            },
        });

        const renderButton = (action: ToolbarAction<T>, index: number) => (
            <InteractionWrapper
                ref={(target) => setItemRef(index, target)}
                sizing={getSizingAt(index)}
                isDisabled={action.isDisabled ?? false}
                isFocusableWhenDisabled={action.isReachableWhenDisabled ?? false}
                isPressed={getPressedValues()?.includes(action.value)}
                isTabbable={index === rovingStop.value}
                onActivation={() => pressAction(action.value)}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags }) => (
                            <button
                                type="button"
                                ref={setElementRef}
                                class={ToolbarStyles.toolbarButton}
                                aria-disabled={flags.isDisabled || undefined}
                                aria-pressed={flags.isPressed}
                            >
                                {callSlot(buttonSlots.renderAction, { action, flags })}
                            </button>
                        ),
                    } satisfies Partial<InteractionWrapperSlots>
                }
            </InteractionWrapper>
        );

        const renderWord = (menuProps: ToolbarMenusProps<T>, index: number) => {
            const word = menuProps.actions[index];

            return (
                <Menu
                    ref={(target) => setItemRef(index, target)}
                    items={word.items}
                    sizing={getSizingAt(index)}
                    isDisabled={word.isDisabled ?? false}
                    isFocusableWhenDisabled={word.isReachableWhenDisabled ?? false}
                    isTabbable={index === rovingStop.value}
                    visibility={openStop.value === index}
                    onUpdate:visibility={(isOpen: boolean) => setStopOpen(index, isOpen)}
                    {...getCheckedProps()}
                    submenuOffset={menuProps.submenuOffset}
                    triggerRole={WORD_ROLE}
                    onActivate={props.onActivate}
                >
                    {
                        {
                            renderContent: (flags) => callSlot(menuSlots.renderAction, { action: word, flags }),
                            renderItem: menuSlots.renderItem,
                            renderPopup: menuSlots.renderPopup,
                        } satisfies Partial<MenuSlots<T>>
                    }
                </Menu>
            );
        };

        return () => {
            const currentLayout = layout.value;
            const isMenubar = getIsMenubar();
            const isOverflowing = hasOverflow.value;
            const hasMeasured = ToolbarUtils.computeHasMeasured(
                currentLayout !== undefined,
                rootSize.value.width,
                itemSizes.value.length,
                actionCount.value,
            );

            const renderActionAt = (action: ToolbarAction<T>, index: number) => {
                const placement = currentLayout?.placements[index];
                const control = props.role === "menubar" ? renderWord(props, index) : renderButton(action, index);

                if (placement) {
                    return (
                        <PlacementItem key={index} placement={placement}>
                            {{ default: () => control }}
                        </PlacementItem>
                    );
                }

                const isShown = cut.value.shownIndexes.includes(index);

                return (
                    <div
                        key={index}
                        class={[ToolbarStyles.toolbarItem, isShown ? "" : ToolbarStyles.toolbarMeasuredItem]}
                        role="presentation"
                        aria-hidden={isShown ? undefined : "true"}
                        inert={isShown ? undefined : true}
                    >
                        {control}
                    </div>
                );
            };

            const items = props.actions.map((action: ToolbarAction<T>, index: number) => renderActionAt(action, index));

            return (
                <div
                    ref={rootRef}
                    class={ToolbarStyles.toolbarRoot}
                    style={{ gap: `${getGap()}px`, visibility: hasMeasured ? undefined : "hidden" }}
                    role={props.role}
                    aria-label={props.ariaLabel}
                    onKeydown={handleKeyDown}
                    onFocusin={(e) => {
                        const stop = ToolbarUtils.computeStopAt(e.target, itemElements.value, overflowRef.value);

                        if (stop !== undefined) focusedStop.value = stop;
                    }}
                >
                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => items }}
                        </PlacementBox>
                    ) : (
                        items
                    )}

                    <div
                        class={[ToolbarStyles.toolbarItem, isOverflowing ? "" : ToolbarStyles.toolbarMeasuredItem]}
                        role="presentation"
                        aria-hidden={isOverflowing ? undefined : "true"}
                        inert={isOverflowing ? undefined : true}
                    >
                        <Menu
                            ref={(target) => {
                                overflowRef.value = toElement(target);
                            }}
                            items={overflowItems.value}
                            ariaLabel={props.overflowAriaLabel}
                            isTabbable={rovingStop.value === OVERFLOW_STOP}
                            visibility={openStop.value === OVERFLOW_STOP}
                            onUpdate:visibility={(isOpen: boolean) => setStopOpen(OVERFLOW_STOP, isOpen)}
                            {...(isMenubar
                                ? getCheckedProps()
                                : {
                                      "checked": pressedValues.value,
                                      "onUpdate:checked": (value: T[]) => {
                                          pressedValues.value = value;
                                      },
                                  })}
                            submenuOffset={props.role === "menubar" ? props.submenuOffset : undefined}
                            triggerRole={isMenubar ? WORD_ROLE : undefined}
                            onActivate={props.onActivate}
                        >
                            {
                                {
                                    renderContent: slots.renderOverflowTrigger,
                                    renderItem: isMenubar ? menuSlots.renderItem : buttonSlots.renderOverflowItem,
                                    renderPopup: isMenubar ? menuSlots.renderPopup : buttonSlots.renderOverflowPopup,
                                } satisfies Partial<MenuSlots<T>>
                            }
                        </Menu>
                    </div>
                </div>
            );
        };
    },
    {
        name: "ToolbarComposite",
        slots: Object as SlotsType<ToolbarCompositeSlots<any>>,
        props: declareProps<ToolbarCompositeProps<unknown>>({
            "gap": null,
            "ariaLabel": null,
            "overflowAriaLabel": null,
            "computeLayout": null,
            "computeEffect": null,
            "onActivate": null,
            "role": null,
            "actions": null,
            "pressedValues": null,
            "onUpdate:pressedValues": null,
            "checked": null,
            "onUpdate:checked": null,
            "submenuOffset": null,
        }),
    },
);

export const Toolbar = defineComponent(
    <T,>(props: ToolbarProps<T>, { slots }: SlotsContext<ToolbarSlots<T>>) => {
        const pressedValues = useTwoWay(props, "pressedValues", undefined, { keepsOwnValue: false });

        return () => (
            <ToolbarComposite
                gap={props.gap}
                ariaLabel={props.ariaLabel}
                overflowAriaLabel={props.overflowAriaLabel}
                computeLayout={props.computeLayout}
                computeEffect={props.computeEffect}
                onActivate={props.onActivate}
                role={"toolbar"}
                actions={props.actions}
                pressedValues={pressedValues.value}
                onUpdate:pressedValues={(values: T[]) => {
                    pressedValues.value = values;
                }}
            >
                {
                    {
                        renderOverflowTrigger: slots.renderOverflowTrigger,
                        renderAction: slots.renderAction,
                        renderOverflowItem: slots.renderOverflowItem,
                        renderOverflowPopup: slots.renderOverflowPopup,
                    } satisfies Partial<ToolbarSlots<T>>
                }
            </ToolbarComposite>
        );
    },
    {
        name: "Toolbar",
        slots: Object as SlotsType<ToolbarSlots<any>>,
        props: declareProps<ToolbarProps<unknown>>({
            "gap": null,
            "ariaLabel": null,
            "overflowAriaLabel": null,
            "computeLayout": null,
            "computeEffect": null,
            "onActivate": null,
            "actions": null,
            "pressedValues": null,
            "onUpdate:pressedValues": null,
        }),
    },
);
