import { type ComponentPublicInstance, type SlotsType, computed, defineComponent, h, shallowRef, watch } from "vue";

import { TABS_DEFAULTS, type TabsFloaterBounds, TabsStyles, TabsUtils } from "@thewaver/ss-components";

import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TabPanelProps, TabPanelSlots, TabsItemProps, TabsProps, TabsSlots } from "./Tabs.types";

export const TabPanel = defineComponent(
    (props: TabPanelProps, { slots }: SlotsContext<TabPanelSlots>) =>
        () => (
            <div id={props.id} role="tabpanel" aria-labelledby={props.tabId} tabindex={0}>
                {slots.default?.()}
            </div>
        ),
    {
        name: "TabPanel",
        slots: Object as SlotsType<TabPanelSlots>,
        props: declareProps<TabPanelProps>({ id: null, tabId: null }),
    },
);

const TabsItem = defineComponent(
    <T,>(props: TabsItemProps<T>, { slots }: SlotsContext<InteractionControlSlots>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const handleClick = (e: MouseEvent) => {
                if (isDisabled) {
                    e.preventDefault();

                    return;
                }

                props.onSelect(props.tab.value);
            };

            const commonProps = {
                "class": TabsStyles.tabsItem,
                "role": "tab",
                "id": props.tab.id,
                "aria-controls": props.tab.panelId,
                "aria-disabled": isDisabled || undefined,
                "aria-selected": props.isSelected,
            };

            const content = callSlot(slots.renderContent, props.flags);

            if (props.tab.href === undefined) {
                return (
                    <button type="button" {...commonProps} onClick={handleClick}>
                        {content}
                    </button>
                );
            }

            if (props.linkComponent === undefined) {
                return (
                    <a href={props.tab.href} {...commonProps} onClick={handleClick}>
                        {content}
                    </a>
                );
            }

            return h(
                props.linkComponent,
                { href: props.tab.href, ...commonProps, onClick: handleClick },
                { default: () => content },
            );
        },
    {
        name: "TabsItem",
        props: declareProps<TabsItemProps<unknown>>({
            ariaLabel: null,
            flags: null,
            tab: null,
            isSelected: Boolean,
            linkComponent: null,
            onSelect: null,
        }),
    },
);

export const Tabs = defineComponent(
    <T,>(props: TabsProps<T>, { slots }: SlotsContext<TabsSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const floaterRef = shallowRef<HTMLDivElement>();

        const itemElements = shallowRef<(HTMLElement | undefined)[]>([]);
        const focusedValue = shallowRef<T>();
        const measuredBounds = shallowRef<TabsFloaterBounds>();

        watch(
            () => props.selectedValue,
            () => {
                focusedValue.value = undefined;
            },
        );

        const getTransitionDurationMs = () => props.transitionDurationMs ?? TABS_DEFAULTS.transitionDurationMs;
        const getOrientation = () => props.orientation ?? TABS_DEFAULTS.orientation;

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const itemCount = computed(() => props.tabs.length);
        const layout = computed(() => props.computeLayout?.({ itemCount: itemCount.value }));

        const selectedIndex = computed(() => TabsUtils.computeSelectedIndex(props.tabs, props.selectedValue));

        const floaterBounds = computed(() => {
            if (layout.value === undefined) return measuredBounds.value;

            const selectedPlacement = layout.value.placements[selectedIndex.value];

            return selectedPlacement === undefined ? undefined : TabsUtils.computePlacedBounds(selectedPlacement);
        });

        const floaterFader = ElementFaderVueUtils.useFader(
            () => selectedIndex.value >= 0 && floaterBounds.value !== undefined,
            { transitionDurationMs: getTransitionDurationMs, ref: floaterRef },
        );

        watchAfterRender([floaterFader.isVisible], ([isVisible]) => {
            if (isVisible) return;

            measuredBounds.value = undefined;
        });

        const getHasFloater = () => slots.renderFloater !== undefined;

        watchAfterRender(
            [getHasFloater, layout, () => itemElements.value[selectedIndex.value]],
            ([hasFloater, currentLayout, selectedItem]) => {
                const root = rootRef.value;

                if (!hasFloater || currentLayout !== undefined || !root || !selectedItem) return;

                return TabsUtils.observeSelectedBounds(root, selectedItem, (bounds) => {
                    measuredBounds.value = bounds;
                });
            },
        );

        const setItemRef = (index: number, target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (itemElements.value[index] === element) return;

            const next = [...itemElements.value];

            next[index] = element;
            itemElements.value = next;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const step = TabsUtils.computeKeyStep(e.key, props.tabs, {
                selectedValue: props.selectedValue,
                focusedValue: focusedValue.value,
                orientation: getOrientation(),
                direction: layout.value === undefined ? direction.value : undefined,
                hasAutoActivation: props.hasAutoActivation ?? false,
            });

            if (step === undefined) return;

            e.preventDefault();

            focusedValue.value = step.value;
            itemElements.value[step.index]?.focus();

            if (step.isSelecting) props.onSelectionChange?.(step.value);
        };

        return () => {
            const transitionDurationMs = getTransitionDurationMs();
            const orientation = getOrientation();
            const tabGap = props.tabGap ?? TABS_DEFAULTS.tabGap;
            const currentLayout = layout.value;
            const rovingIndex = TabsUtils.computeRovingIndex(props.tabs, props.selectedValue, focusedValue.value);
            const bounds = floaterBounds.value;

            const renderTabAt = (tab: (typeof props.tabs)[number], index: number) => {
                const placement = currentLayout?.placements[index];

                const element = (
                    <InteractionWrapper
                        key={index}
                        ref={(target) => setItemRef(index, target)}
                        sizing={orientation === "vertical" || currentLayout !== undefined ? "fill" : "fit-content"}
                        isDisabled={tab.isDisabled ?? false}
                        isFocusableWhenDisabled={tab.isReachableWhenDisabled ?? false}
                        isTabbable={index === rovingIndex}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <TabsItem
                                        ref={setElementRef}
                                        tab={tab}
                                        flags={flags}
                                        isSelected={index === selectedIndex.value}
                                        linkComponent={props.linkComponent}
                                        onSelect={(value) => {
                                            if (value === props.selectedValue) return;

                                            props.onSelectionChange?.(value);
                                        }}
                                    >
                                        {
                                            {
                                                renderContent: (itemFlags) =>
                                                    callSlot(slots.renderTab, { tab, flags: itemFlags, placement }),
                                            } satisfies InteractionControlSlots
                                        }
                                    </TabsItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots>
                        }
                    </InteractionWrapper>
                );

                return placement ? (
                    <PlacementItem key={index} placement={placement}>
                        {element}
                    </PlacementItem>
                ) : (
                    element
                );
            };

            const isFloaterRendered = getHasFloater() && floaterFader.isVisible.value && bounds !== undefined;

            const content = [
                isFloaterRendered && (
                    <div
                        ref={floaterRef}
                        class={TabsStyles.tabsFloater}
                        style={{ ...bounds, transitionDuration: `${transitionDurationMs}ms` }}
                    >
                        {callSlot(slots.renderFloater, {
                            visibilityTarget: floaterFader.transitionTarget.value,
                            transitionDurationMs,
                        })}
                    </div>
                ),
                ...props.tabs.map(renderTabAt),
            ];

            return (
                <div
                    ref={rootRef}
                    class={TabsStyles.tabsRoot}
                    style={{ flexDirection: orientation === "horizontal" ? "row" : "column", gap: `${tabGap}px` }}
                    role="tablist"
                    aria-label={props.ariaLabel}
                    aria-orientation={orientation}
                    onKeydown={handleKeyDown}
                >
                    {slots.renderGutter && <div class={TabsStyles.tabsGutter}>{slots.renderGutter()}</div>}

                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => content }}
                        </PlacementBox>
                    ) : (
                        content
                    )}
                </div>
            );
        };
    },
    {
        name: "Tabs",
        slots: Object as SlotsType<TabsSlots<any>>,
        props: declareProps<TabsProps<unknown>>({
            orientation: null,
            hasAutoActivation: Boolean,
            tabGap: null,
            transitionDurationMs: null,
            ariaLabel: null,
            linkComponent: null,
            tabs: null,
            selectedValue: null,
            computeLayout: null,
            computeEffect: null,
            onSelectionChange: null,
        }),
    },
);
