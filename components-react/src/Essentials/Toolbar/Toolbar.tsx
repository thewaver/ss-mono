import { type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    type InteractionSizing,
    type MenuItemKind,
    type MenuTriggerRole,
    MenuUtils,
    TOOLBAR_DEFAULTS,
    type ToolbarAction,
    ToolbarStyles,
    ToolbarUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { Menu } from "../Menus/Menu/Menu";
import type { MenuItem } from "../Menus/Menu/Menu.types";
import type { ToolbarButtonsProps, ToolbarCompositeProps, ToolbarMenusProps, ToolbarProps } from "./Toolbar.types";

const OVERFLOW_STOP = ToolbarUtils.OVERFLOW_STOP;
const NO_RADIO_GROUP: never[] = [];
const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";
const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
const WORD_ROLE: MenuTriggerRole = "menuitem";

export const ToolbarComposite = <T,>(props: ToolbarCompositeProps<T>) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const overflowRef = useRef<HTMLElement | null>(null);

    const [itemElements, setItemElements] = useState<(HTMLElement | undefined)[]>([]);
    const [focusedStop, setFocusedStop] = useState<number>();
    const [openStop, setOpenStop] = useState<number>();
    const [switchStop, setSwitchStop] = useState<number>();

    const isMenubar = props.role === "menubar";
    const gap = props.gap ?? TOOLBAR_DEFAULTS.gap;
    const actions: ToolbarAction<T>[] = props.actions;
    const actionCount = actions.length;
    const pressedValues = props.role === "toolbar" ? props.pressedValuesState?.[0] : undefined;
    const isPressable = pressedValues !== undefined;

    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount: actionCount }), [computeLayout, actionCount]);
    const isPlaced = layout !== undefined;

    const rootSize = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const itemSizes = ElementObserverReactUtils.useBorderBoxSizes(itemElements);
    const overflowSize = ElementObserverReactUtils.useBorderBoxSize(overflowRef);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const hasMeasured = ToolbarUtils.computeHasMeasured(isPlaced, rootSize.width, itemSizes.length, actionCount);

    const cut = useMemo(
        () =>
            isPlaced
                ? ToolbarUtils.computeUncut(actions.length)
                : ToolbarUtils.computeCut({
                      widths: itemSizes.map((size) => size.width),
                      collapses: actions.map((action) => action.collapse ?? "auto"),
                      available: rootSize.width,
                      overflowWidth: overflowSize.width,
                      gap,
                  }),
        [isPlaced, actions, itemSizes, rootSize.width, overflowSize.width, gap],
    );

    const overflowItems = useMemo(
        () =>
            ToolbarUtils.computeOverflowItems<T, MenuItem<T>>(props.actions, cut.collapsedIndexes, {
                hasSubmenus: isMenubar,
                isPressable,
            }) as MenuItem<T>[],
        [props.actions, cut.collapsedIndexes, isMenubar, isPressable],
    );

    const hasOverflow = overflowItems.length > 0;

    const stops = useMemo(() => ToolbarUtils.computeStops(actions, cut.shownIndexes), [actions, cut.shownIndexes]);

    const rovingStop = ToolbarUtils.computeRovingStop(stops, focusedStop, hasOverflow);

    const setItemRef = (index: number, element: HTMLElement | null) => {
        setItemElements((previous) => {
            if (previous[index] === (element ?? undefined)) return previous;

            const next = [...previous];

            next[index] = element ?? undefined;

            return next;
        });
    };

    const focusStop = (stop: number) => {
        setFocusedStop(stop);

        if (stop === OVERFLOW_STOP) overflowRef.current?.focus();
        else itemElements[stop]?.focus();
    };

    const createStopVisibility = (stop: number) =>
        [
            openStop === stop,
            (isOpen: boolean) => setOpenStop((open) => ToolbarUtils.computeNextOpenStop(open, stop, isOpen)),
        ] as const;

    useLayoutEffect(() => {
        const step = ToolbarUtils.computeFocusLanding(stops, focusedStop, hasOverflow);

        if (focusedStop === undefined || step === undefined) return;

        const hadFocus = itemElements[focusedStop]?.contains(document.activeElement);

        setFocusedStop(step.landing);

        if (!hadFocus || step.landing === undefined) return;

        focusStop(step.landing);
    }, [stops, focusedStop, hasOverflow]);

    useEffect(() => {
        if (openStop === undefined) return;
        if (ToolbarUtils.getIsStopPresent(openStop, stops, hasOverflow)) return;

        setOpenStop(undefined);
    }, [openStop, stops, hasOverflow]);

    useEffect(() => {
        if (switchStop === undefined) return;

        setSwitchStop(undefined);
        focusStop(switchStop);
        setOpenStop(switchStop);
    }, [switchStop]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.defaultPrevented) return;

        const step = ToolbarUtils.computeKeyStep(e.key, {
            isFromRow: e.target instanceof Node && (rootRef.current?.contains(e.target) ?? false),
            stops,
            hasOverflow,
            openStop: isMenubar ? openStop : undefined,
            rovingStop,
            isPlaced,
            direction,
        });

        if (step === undefined) return;

        e.preventDefault();

        if (!step.isSwitch) {
            focusStop(step.stop);

            return;
        }

        setOpenStop(undefined);
        setSwitchStop(step.stop);
    };

    const pressAction = (buttonProps: ToolbarButtonsProps<T>, value: T) => {
        const pressedValuesState = buttonProps.pressedValuesState;

        if (pressedValuesState) {
            pressedValuesState[1](
                MenuUtils.computeNextChecked(pressedValuesState[0], { value, kind: PRESSED_ITEM_KIND }, NO_RADIO_GROUP),
            );
        }

        props.onActivate(value);
    };

    const getSizingAt = (index: number) => (layout?.placements[index] === undefined ? ROW_SIZING : PLACED_SIZING);

    const renderButton = (buttonProps: ToolbarButtonsProps<T>, action: ToolbarAction<T>, index: number) => (
        <InteractionWrapper
            sizing={getSizingAt(index)}
            isDisabled={action.isDisabled ?? false}
            isFocusableWhenDisabled={action.isReachableWhenDisabled ?? false}
            isPressed={pressedValues?.includes(action.value)}
            isTabbable={index === rovingStop}
            ref={(element) => setItemRef(index, element)}
            onActivation={() => pressAction(buttonProps, action.value)}
            renderControl={(setElementRef, flags) => (
                <button
                    type="button"
                    ref={setElementRef}
                    className={ToolbarStyles.toolbarButton}
                    aria-disabled={flags.isDisabled || undefined}
                    aria-pressed={flags.isPressed}
                >
                    {buttonProps.renderAction(action, flags)}
                </button>
            )}
        />
    );

    const renderWord = (menuProps: ToolbarMenusProps<T>, index: number) => {
        const word = menuProps.actions[index];

        return (
            <Menu<T>
                items={word.items}
                sizing={getSizingAt(index)}
                isDisabled={word.isDisabled ?? false}
                isFocusableWhenDisabled={word.isReachableWhenDisabled ?? false}
                isTabbable={index === rovingStop}
                visibilityState={createStopVisibility(index)}
                checkedState={menuProps.checkedState}
                submenuOffset={menuProps.submenuOffset}
                triggerRole={WORD_ROLE}
                ref={(element) => setItemRef(index, element)}
                renderContent={(flags) => menuProps.renderAction(word, flags)}
                renderItem={menuProps.renderItem}
                renderPopup={menuProps.renderPopup}
                onActivate={props.onActivate}
            />
        );
    };

    const renderActionAt = (action: ToolbarAction<T>, index: number) => {
        const placement = layout?.placements[index];
        const control = props.role === "menubar" ? renderWord(props, index) : renderButton(props, action, index);

        if (placement) {
            return (
                <PlacementItem key={index} placement={placement}>
                    {control}
                </PlacementItem>
            );
        }

        const isShown = cut.shownIndexes.includes(index);

        return (
            <div
                key={index}
                className={[ToolbarStyles.toolbarItem, isShown ? "" : ToolbarStyles.toolbarMeasuredItem].join(" ")}
                role="presentation"
                aria-hidden={isShown ? undefined : "true"}
                inert={isShown ? undefined : true}
            >
                {control}
            </div>
        );
    };

    const items = actions.map(renderActionAt);

    return (
        <div
            ref={rootRef}
            className={ToolbarStyles.toolbarRoot}
            style={{ gap: `${gap}px`, visibility: hasMeasured ? undefined : "hidden" }}
            role={props.role}
            aria-label={props.ariaLabel}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
                const stop = ToolbarUtils.computeStopAt(e.target, itemElements, overflowRef.current);

                if (stop !== undefined) setFocusedStop(stop);
            }}
        >
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {items}
                </PlacementBox>
            ) : (
                items
            )}

            <div
                className={[ToolbarStyles.toolbarItem, hasOverflow ? "" : ToolbarStyles.toolbarMeasuredItem].join(" ")}
                role="presentation"
                aria-hidden={hasOverflow ? undefined : "true"}
                inert={hasOverflow ? undefined : true}
            >
                <Menu<T>
                    items={overflowItems}
                    ariaLabel={props.overflowAriaLabel}
                    isTabbable={rovingStop === OVERFLOW_STOP}
                    visibilityState={createStopVisibility(OVERFLOW_STOP)}
                    checkedState={props.role === "menubar" ? props.checkedState : props.pressedValuesState}
                    submenuOffset={props.role === "menubar" ? props.submenuOffset : undefined}
                    triggerRole={isMenubar ? WORD_ROLE : undefined}
                    ref={(element) => {
                        overflowRef.current = element;
                    }}
                    renderContent={props.renderOverflowTrigger}
                    renderItem={props.role === "menubar" ? props.renderItem : props.renderOverflowItem}
                    renderPopup={props.role === "menubar" ? props.renderPopup : props.renderOverflowPopup}
                    onActivate={props.onActivate}
                />
            </div>
        </div>
    );
};

export const Toolbar = <T,>(props: ToolbarProps<T>) => <ToolbarComposite<T> {...props} role={"toolbar"} />;
