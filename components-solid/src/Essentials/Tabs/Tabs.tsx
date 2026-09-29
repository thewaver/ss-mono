import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    TABS_DEFAULTS,
    type Tab,
    type TabsFloaterBounds,
    TabsUtils,
    TabsStyles as styles,
} from "@thewaver/ss-components";

import { ElementFaderSolidUtils } from "../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { TabPanelProps, TabsItemProps, TabsProps } from "./TabsSolid.types";

export const TabPanel = (props: TabPanelProps) => {
    return (
        <div id={access(props.id)} role="tabpanel" aria-labelledby={access(props.tabId)} tabindex={0}>
            {props.children}
        </div>
    );
};

const TabsItem = <T,>(props: TabsItemProps<T>) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const handleClick = (e: MouseEvent) => {
        if (getIsDisabled()) {
            e.preventDefault();
            return;
        }

        props.onSelect(access(props.tab).value);
    };

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "class": styles.tabsItem,
        "role": "tab",
        get "id"() {
            return access(props.tab).id;
        },
        get "aria-controls"() {
            return access(props.tab).panelId;
        },
        get "aria-disabled"() {
            return getIsDisabled() || undefined;
        },
        get "aria-selected"() {
            return access(props.isSelected);
        },
    };

    return (
        <Show
            when={access(props.tab).href}
            fallback={
                <button type="button" ref={(element) => props.ref?.(element)} {...commonProps} onClick={handleClick}>
                    {props.renderContent(() => access(props.flags))}
                </button>
            }
        >
            <Dynamic
                component={props.linkComponent ?? "a"}
                ref={(element: HTMLElement) => props.ref?.(element)}
                href={access(props.tab).href!}
                {...commonProps}
                onClick={handleClick}
            >
                {props.renderContent(() => access(props.flags))}
            </Dynamic>
        </Show>
    );
};

export const Tabs = <T,>(props: TabsProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getFocusedValue, setFocusedValue] = createSignal<T | undefined>();
    const [getMeasuredBounds, setMeasuredBounds] = createSignal<TabsFloaterBounds | undefined>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TABS_DEFAULTS.transitionDurationMs,
    );

    const getOrientation = createMemo(() => access(props.orientation) ?? TABS_DEFAULTS.orientation);

    const getTabGap = createMemo(() => access(props.tabGap) ?? TABS_DEFAULTS.tabGap);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: access(props.tabs).length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const setItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((prev) => {
            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    const getSelectedIndex = createMemo(() =>
        TabsUtils.computeSelectedIndex(access(props.tabs), access(props.selectedValue)),
    );

    const getFloaterBounds = createMemo(() => {
        const layout = getLayout();
        const placement = getPlacementAt(getSelectedIndex());

        if (layout === undefined) return getMeasuredBounds();
        if (placement === undefined) return undefined;

        return TabsUtils.computePlacedBounds(placement);
    });

    const getIsFloaterShown = createMemo(() => getSelectedIndex() >= 0 && getFloaterBounds() !== undefined);

    const [getFloaterRef, setFloaterRef] = createSignal<HTMLElement>();

    const floaterFader = ElementFaderSolidUtils.createFader(getIsFloaterShown, {
        getTransitionDurationMs,
        getRef: getFloaterRef,
    });

    createEffect(() => {
        if (floaterFader.getIsVisible()) return;

        setMeasuredBounds(undefined);
    });

    const getRovingIndex = createMemo(() =>
        TabsUtils.computeRovingIndex(access(props.tabs), access(props.selectedValue), getFocusedValue()),
    );

    createEffect(() => {
        access(props.selectedValue);

        setFocusedValue(() => undefined);
    });

    createEffect(() => {
        if (!props.renderFloater || getLayout() !== undefined) return;

        const rootRef = getRootRef();
        const selectedItem = getItemRefs()[getSelectedIndex()];

        if (!rootRef || !selectedItem) return;

        onCleanup(TabsUtils.observeSelectedBounds(rootRef, selectedItem, setMeasuredBounds));
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const step = TabsUtils.computeKeyStep(e.key, access(props.tabs), {
            selectedValue: access(props.selectedValue),
            focusedValue: getFocusedValue(),
            orientation: getOrientation(),
            direction: getLayout() === undefined ? getDirection() : undefined,
            hasAutoActivation: access(props.hasAutoActivation) ?? false,
        });

        if (step === undefined) return;

        e.preventDefault();

        setFocusedValue(() => step.value);
        getItemRefs()[step.index]?.focus();

        if (step.isSelecting) props.onSelectionChange?.(step.value);
    };

    const renderTabAt = (getTab: Accessor<Tab<T>>, index: number) => {
        const getPlacement = createMemo(() => getPlacementAt(index));

        const element = (
            <InteractionWrapper
                sizing={() => (getOrientation() === "vertical" || getLayout() !== undefined ? "fill" : "fit-content")}
                isDisabled={() => getTab().isDisabled ?? false}
                isFocusableWhenDisabled={() => getTab().isReachableWhenDisabled ?? false}
                isTabbable={() => index === getRovingIndex()}
                ref={(element) => setItemRef(index, element)}
                renderControl={(setElementRef, getFlags) => (
                    <TabsItem
                        ref={setElementRef}
                        tab={getTab}
                        flags={getFlags}
                        isSelected={() => index === getSelectedIndex()}
                        linkComponent={props.linkComponent}
                        renderContent={(getItemFlags) => props.renderTab(getTab, getItemFlags, getPlacement)}
                        onSelect={(value) => {
                            if (value === access(props.selectedValue)) return;

                            props.onSelectionChange?.(value);
                        }}
                    />
                )}
            />
        );

        return (
            <Show when={getPlacement()} fallback={element}>
                {(getRect) => <PlacementItem placement={getRect}>{element}</PlacementItem>}
            </Show>
        );
    };

    const renderTabs = () => <Index each={access(props.tabs)}>{renderTabAt}</Index>;

    const getIsFloaterRendered = createMemo(
        () => props.renderFloater !== undefined && floaterFader.getIsVisible() && getFloaterBounds() !== undefined,
    );

    const renderFloater = () => (
        <Show when={getIsFloaterRendered()}>
            <div
                ref={setFloaterRef}
                class={styles.tabsFloater}
                style={{ ...getFloaterBounds(), "transition-duration": `${getTransitionDurationMs()}ms` }}
            >
                {props.renderFloater!(floaterFader.getTransitionTarget, getTransitionDurationMs)}
            </div>
        </Show>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.tabsRoot}
            style={{
                "flex-direction": getOrientation() === "horizontal" ? "row" : "column",
                "gap": `${getTabGap()}px`,
            }}
            role="tablist"
            aria-label={access(props.ariaLabel)}
            aria-orientation={getOrientation()}
            onKeyDown={handleKeyDown}
        >
            {props.renderGutter && <div class={styles.tabsGutter}>{props.renderGutter()}</div>}

            <Show
                when={getLayout()}
                fallback={
                    <>
                        {renderFloater()}
                        {renderTabs()}
                    </>
                }
            >
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderFloater()}
                        {renderTabs()}
                    </PlacementBox>
                )}
            </Show>
        </div>
    );
};
