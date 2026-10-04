import { Fragment, type KeyboardEvent, type MouseEvent, useCallback, useMemo, useRef, useState } from "react";

import { FloaterStyles, TABS_DEFAULTS, TabsStyles, TabsUtils } from "@thewaver/ss-components";

import { FloaterReactUtils } from "../../Abstracts/Floater/FloaterReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { useElement } from "../../Utils/refUtils";
import type { TabPanelProps, TabsItemProps, TabsProps } from "./Tabs.types";

export const TabPanel = (props: TabPanelProps) => (
    <div id={props.id} role="tabpanel" aria-labelledby={props.tabId} tabIndex={0}>
        {props.children}
    </div>
);

const TabsItem = <T,>(props: TabsItemProps<T>) => {
    const isDisabled = props.flags.isDisabled ?? false;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onSelect(props.tab.value);
    };

    const commonProps = {
        "className": TabsStyles.tabsItem,
        "role": "tab",
        "id": props.tab.id,
        "aria-controls": props.tab.panelId,
        "aria-disabled": isDisabled || undefined,
        "aria-selected": props.isSelected,
    } as const;

    if (props.tab.href === undefined) {
        return (
            <button type="button" ref={props.ref} {...commonProps} onClick={handleClick}>
                {props.renderContent(props.flags)}
            </button>
        );
    }

    const Link = props.linkComponent ?? "a";

    return (
        <Link ref={props.ref} href={props.tab.href} {...commonProps} onClick={handleClick}>
            {props.renderContent(props.flags)}
        </Link>
    );
};

export const Tabs = <T,>(props: TabsProps<T>) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    const [itemElements, setItemElements] = useState<(HTMLElement | undefined)[]>([]);
    const [focusedValue, setFocusedValue] = useState<T | undefined>();
    const [hoveredIndex, setHoveredIndex] = useState<number>();
    const [focusedIndex, setFocusedIndex] = useState<number>();
    const [previousSelectedValue, setPreviousSelectedValue] = useState(props.selectedValue);

    if (previousSelectedValue !== props.selectedValue) {
        setPreviousSelectedValue(props.selectedValue);
        setFocusedValue(undefined);
    }

    const transitionDurationMs = props.transitionDurationMs ?? TABS_DEFAULTS.transitionDurationMs;
    const orientation = props.orientation ?? TABS_DEFAULTS.orientation;
    const tabGap = props.tabGap ?? TABS_DEFAULTS.tabGap;
    const tabs = props.tabs;
    const itemCount = tabs.length;

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount }), [computeLayout, itemCount]);

    const selectedIndex = TabsUtils.computeSelectedIndex(tabs, props.selectedValue);
    const rovingIndex = TabsUtils.computeRovingIndex(tabs, props.selectedValue, focusedValue);
    const highlightIndex = hoveredIndex ?? focusedIndex;

    const root = useElement(rootRef);

    const useTabFloater = (isEnabled: boolean, index: number | undefined) => {
        const isItem = index !== undefined && index >= 0;

        return FloaterReactUtils.useFloater({
            isEnabled,
            container: layout === undefined ? root : undefined,
            target: isItem ? itemElements[index] : undefined,
            layout,
            placement: isItem ? layout?.placements[index] : undefined,
            transitionDurationMs,
        });
    };

    const selectionFloater = useTabFloater(props.renderSelectionFloater !== undefined, selectedIndex);

    const highlightFloater = useTabFloater(props.renderHighlightFloater !== undefined, highlightIndex);

    const findItemIndex = (target: EventTarget | null) =>
        target instanceof Node ? itemElements.findIndex((item) => item?.contains(target) ?? false) : -1;

    const toIndex = (index: number) => (index < 0 ? undefined : index);

    const latestItemElementsRef = useRef<(HTMLElement | undefined)[]>([]);

    const setItemRef = useCallback((index: number, element: HTMLElement | null) => {
        latestItemElementsRef.current[index] = element ?? undefined;

        setItemElements((previous) => {
            const latest = latestItemElementsRef.current;
            const isSame = previous.length === latest.length && previous.every((entry, at) => entry === latest[at]);

            return isSame ? previous : [...latest];
        });
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const step = TabsUtils.computeKeyStep(e.key, tabs, {
            selectedValue: props.selectedValue,
            focusedValue,
            orientation,
            direction: layout === undefined ? direction : undefined,
            hasAutoActivation: props.hasAutoActivation ?? false,
        });

        if (step === undefined) return;

        e.preventDefault();

        setFocusedValue(step.value);
        itemElements[step.index]?.focus();

        if (step.isSelecting) props.onSelectionChange?.(step.value);
    };

    const renderTabAt = (tab: (typeof tabs)[number], index: number) => {
        const placement = layout?.placements[index];

        const element = (
            <InteractionWrapper
                sizing={orientation === "vertical" || layout !== undefined ? "fill" : "fit-content"}
                isDisabled={tab.isDisabled ?? false}
                isFocusableWhenDisabled={tab.isReachableWhenDisabled ?? false}
                isTabbable={index === rovingIndex}
                ref={(itemElement) => setItemRef(index, itemElement)}
                renderControl={(setElementRef, flags) => (
                    <TabsItem
                        ref={setElementRef}
                        tab={tab}
                        flags={flags}
                        isSelected={index === selectedIndex}
                        linkComponent={props.linkComponent}
                        renderContent={(itemFlags) => props.renderTab(tab, itemFlags, placement)}
                        onSelect={(value) => {
                            if (value === props.selectedValue) return;

                            props.onSelectionChange?.(value);
                        }}
                    />
                )}
            />
        );

        return placement ? (
            <PlacementItem key={index} placement={placement}>
                {element}
            </PlacementItem>
        ) : (
            <Fragment key={index}>{element}</Fragment>
        );
    };

    const renderFloater = (
        floater: ReturnType<typeof useTabFloater>,
        renderContent: TabsProps<T>["renderSelectionFloater"],
    ) =>
        floater.isRendered && (
            <div
                ref={floater.ref}
                className={FloaterStyles.floater}
                style={{ ...floater.bounds, transitionDuration: `${transitionDurationMs}ms` }}
            >
                {renderContent?.(floater.visibilityTarget, transitionDurationMs)}
            </div>
        );

    const content = (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
            {tabs.map(renderTabAt)}
        </>
    );

    return (
        <div
            ref={rootRef}
            className={TabsStyles.tabsRoot}
            style={{ flexDirection: orientation === "horizontal" ? "row" : "column", gap: `${tabGap}px` }}
            role="tablist"
            aria-label={props.ariaLabel}
            aria-orientation={orientation}
            onKeyDown={handleKeyDown}
            onPointerOver={(e) => setHoveredIndex(toIndex(findItemIndex(e.target)))}
            onPointerLeave={() => setHoveredIndex(undefined)}
            onFocus={(e) => setFocusedIndex(toIndex(findItemIndex(e.target)))}
            onBlur={() => setFocusedIndex(undefined)}
        >
            {props.renderGutter && <div className={TabsStyles.tabsGutter}>{props.renderGutter()}</div>}

            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {content}
                </PlacementBox>
            ) : (
                content
            )}
        </div>
    );
};
