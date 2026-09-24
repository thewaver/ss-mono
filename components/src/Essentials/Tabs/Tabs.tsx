import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import { TABS_DEFAULTS } from "./Tabs.const";
import type { Tab, TabPanelProps, TabsItemProps, TabsProps } from "./Tabs.types";

import * as styles from "./Tabs.css";

const NO_ANGLE = 0;
const HALF = 0.5;

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
    const [getMeasuredBounds, setMeasuredBounds] = createSignal<
        { [k in "top" | "left" | "width" | "height"]: string } | undefined
    >();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TABS_DEFAULTS.transitionDurationMs,
    );

    const getOrientation = createMemo(() => access(props.orientation) ?? TABS_DEFAULTS.orientation);

    const getTabGap = createMemo(() => access(props.tabGap) ?? TABS_DEFAULTS.tabGap);

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: access(props.tabs).length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const setItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((prev) => {
            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    const getSelectedIndex = createMemo(() => {
        const selectedValue = access(props.selectedValue);

        return access(props.tabs).findIndex((tab) => tab.value === selectedValue);
    });

    const getNavigableIndexes = createMemo(() =>
        access(props.tabs).reduce<number[]>((acc, tab, index) => {
            if (!tab.isDisabled || tab.isReachableWhenDisabled) acc.push(index);

            return acc;
        }, []),
    );

    const toPlacedBounds = (placement: PlacementRect) => ({
        top: PlacementUtils.toContainerWidth(placement.topShare - placement.heightShare * HALF),
        left: PlacementUtils.toContainerWidth(placement.leftShare - placement.widthShare * HALF),
        width: PlacementUtils.toContainerWidth(placement.widthShare),
        height: PlacementUtils.toContainerWidth(placement.heightShare),
        transform: `rotate(${placement.angle ?? NO_ANGLE}deg)`,
    });

    const getFloaterBounds = createMemo(() => {
        const layout = getLayout();
        const placement = getPlacementAt(getSelectedIndex());

        if (layout === undefined) return getMeasuredBounds();
        if (placement === undefined) return undefined;

        return toPlacedBounds(placement);
    });

    const getIsFloaterShown = createMemo(() => getSelectedIndex() >= 0 && getFloaterBounds() !== undefined);

    const [getFloaterRef, setFloaterRef] = createSignal<HTMLElement>();

    const floaterFader = ElementFaderUtils.createFader(getIsFloaterShown, {
        getTransitionDurationMs,
        getRef: getFloaterRef,
    });

    createEffect(() => {
        if (floaterFader.getIsVisible()) return;

        setMeasuredBounds(undefined);
    });

    const getRovingIndex = createMemo(() => {
        const navigable = getNavigableIndexes();
        const tabs = access(props.tabs);
        const focusedValue = getFocusedValue();

        const focusedIndex = navigable.find((index) => tabs[index].value === focusedValue);

        if (focusedIndex !== undefined) return focusedIndex;

        const selectedIndex = getSelectedIndex();

        if (navigable.includes(selectedIndex)) return selectedIndex;

        return navigable[0];
    });

    createEffect(() => {
        access(props.selectedValue);

        setFocusedValue(() => undefined);
    });

    createEffect(() => {
        let selectedItemObserver: ResizeObserver | undefined;

        onCleanup(() => {
            selectedItemObserver?.disconnect();
        });

        if (!props.renderFloater || getLayout() !== undefined) return;

        const rootRef = getRootRef();
        const selectedItem = getItemRefs()[getSelectedIndex()];
        const selectedWrapper = selectedItem?.offsetParent as HTMLElement | null;

        if (!rootRef || !selectedWrapper) return;

        selectedItemObserver = new ResizeObserver(() => {
            setMeasuredBounds({
                top: `${selectedWrapper.offsetTop}px`,
                left: `${selectedWrapper.offsetLeft}px`,
                width: `${selectedWrapper.offsetWidth}px`,
                height: `${selectedWrapper.offsetHeight}px`,
            });
        });
        selectedItemObserver.observe(rootRef);
        selectedItemObserver.observe(selectedWrapper);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const navigable = getNavigableIndexes();

        if (navigable.length < 1) return;

        const from = navigable.indexOf(getRovingIndex() ?? navigable[0]);
        const position = NavigatorUtils.computeNextPosition(e.key, from, navigable.length, {
            orientation: getOrientation(),
            direction: getLayout() === undefined ? getDirection() : undefined,
        });

        if (position === undefined) return;

        e.preventDefault();

        const next = navigable[position];
        const nextTab = access(props.tabs)[next];
        const nextValue = nextTab.value;

        setFocusedValue(() => nextValue);
        getItemRefs()[next]?.focus();

        if (!access(props.hasAutoActivation) || nextTab.isDisabled) return;
        if (nextValue === access(props.selectedValue)) return;

        props.onSelectionChange?.(nextValue);
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
