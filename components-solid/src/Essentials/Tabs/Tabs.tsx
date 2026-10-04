import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    TABS_DEFAULTS,
    type Tab,
    TabsUtils,
    FloaterStyles as floaterStyles,
    TabsStyles as styles,
} from "@thewaver/ss-components";

import { FloaterSolidUtils } from "../../Abstracts/Floater/FloaterSolid.utils";
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

    const [getHoveredIndex, setHoveredIndex] = createSignal<number>();
    const [getFocusedIndex, setFocusedIndex] = createSignal<number>();

    const getHighlightIndex = createMemo(() => getHoveredIndex() ?? getFocusedIndex());

    const findItemIndex = (target: EventTarget | null) =>
        target instanceof Node ? getItemRefs().findIndex((item) => item?.contains(target) ?? false) : -1;

    const createFloater = (getIsEnabled: () => boolean, getIndex: () => number | undefined) =>
        FloaterSolidUtils.create({
            getIsEnabled,
            getContainer: () => (getLayout() === undefined ? getRootRef() : undefined),
            getTarget: () => {
                const index = getIndex();

                return index === undefined || index < 0 ? undefined : getItemRefs()[index];
            },
            getLayout,
            getPlacement: () => {
                const index = getIndex();

                return index === undefined || index < 0 ? undefined : getPlacementAt(index);
            },
            getTransitionDurationMs,
        });

    const selectionFloater = createFloater(() => props.renderSelectionFloater !== undefined, getSelectedIndex);

    const highlightFloater = createFloater(() => props.renderHighlightFloater !== undefined, getHighlightIndex);

    const getRovingIndex = createMemo(() =>
        TabsUtils.computeRovingIndex(access(props.tabs), access(props.selectedValue), getFocusedValue()),
    );

    createEffect(() => {
        access(props.selectedValue);

        setFocusedValue(() => undefined);
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

    const renderFloater = (
        floater: ReturnType<typeof createFloater>,
        renderContent: TabsProps<T>["renderSelectionFloater"],
    ) => (
        <Show when={floater.getIsRendered()}>
            <div
                ref={floater.setRef}
                class={floaterStyles.floater}
                style={{ ...floater.getBounds(), "transition-duration": `${getTransitionDurationMs()}ms` }}
            >
                {renderContent?.(floater.getVisibilityTarget, getTransitionDurationMs)}
            </div>
        </Show>
    );

    const renderFloaters = () => (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
        </>
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
            onPointerOver={(e) => {
                const index = findItemIndex(e.target);

                setHoveredIndex(index < 0 ? undefined : index);
            }}
            onPointerLeave={() => setHoveredIndex(undefined)}
            onFocusIn={(e) => {
                const index = findItemIndex(e.target);

                setFocusedIndex(index < 0 ? undefined : index);
            }}
            onFocusOut={() => setFocusedIndex(undefined)}
        >
            {props.renderGutter && <div class={styles.tabsGutter}>{props.renderGutter()}</div>}

            <Show
                when={getLayout()}
                fallback={
                    <>
                        {renderFloaters()}
                        {renderTabs()}
                    </>
                }
            >
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderFloaters()}
                        {renderTabs()}
                    </PlacementBox>
                )}
            </Show>
        </div>
    );
};
