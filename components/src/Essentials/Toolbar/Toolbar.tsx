import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal } from "solid-js";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import type { NavigatorOrientation } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionSizing } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { SignalPair } from "../../Utils/typeUtils";
import { Menu } from "../Menus/Menu/Menu";
import type { MenuItem, MenuItemKind, MenuTriggerRole } from "../Menus/Menu/Menu.types";
import { MenuUtils } from "../Menus/Menu/Menu.utils";
import { TOOLBAR_DEFAULTS } from "./Toolbar.const";
import type {
    ToolbarAction,
    ToolbarButtonsProps,
    ToolbarCompositeProps,
    ToolbarMenusProps,
    ToolbarProps,
} from "./Toolbar.types";
import { ToolbarUtils } from "./Toolbar.utils";

import * as styles from "./Toolbar.css";

const OVERFLOW_STOP = -1;
const NO_WIDTH = 0;
const NO_RADIO_GROUP: never[] = [];
const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";
const HORIZONTAL_ORIENTATION: NavigatorOrientation = "horizontal";
const PLACED_ORIENTATION: NavigatorOrientation = "both";
const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
const WORD_ROLE: MenuTriggerRole = "menuitem";
const MENU_SWITCH_KEYS = ["ArrowLeft", "ArrowRight"];

export const ToolbarComposite = <T,>(props: ToolbarCompositeProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getOverflowRef, setOverflowRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getFocusedStop, setFocusedStop] = createSignal<number>();
    const [getOpenStop, setOpenStop] = createSignal<number>();

    const getGap = createMemo(() => access(props.gap) ?? TOOLBAR_DEFAULTS.gap);

    const getActions = createMemo((): ToolbarAction<T>[] => access(props.actions));

    const getPressedValues = createMemo(() =>
        props.role === "toolbar" ? props.pressedValuesSignal?.[0]() : undefined,
    );

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getActions().length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getRootSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getItemSizes = ElementObserverUtils.createBorderBoxSizeListObserver(getItemRefs);

    const getOverflowSize = ElementObserverUtils.createBorderBoxSizeObserver(getOverflowRef);

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const setItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((previous) => {
            const next = [...previous];

            next[index] = element;

            return next;
        });
    };

    const getHasMeasured = createMemo(
        () =>
            getLayout() !== undefined ||
            (getRootSize().width > NO_WIDTH && getItemSizes().length === getActions().length),
    );

    const getCut = createMemo(() =>
        getLayout() === undefined
            ? ToolbarUtils.computeCut({
                  widths: getItemSizes().map((size) => size.width),
                  collapses: getActions().map((action) => action.collapse ?? "auto"),
                  available: getRootSize().width,
                  overflowWidth: getOverflowSize().width,
                  gap: getGap(),
              })
            : { shownIndexes: getActions().map((_unused, index) => index), collapsedIndexes: [] },
    );

    const getIsShown = (index: number) => getCut().shownIndexes.includes(index);

    const getOverflowItems = createMemo((): MenuItem<T>[] =>
        getCut().collapsedIndexes.map((index) => {
            const action = getActions()[index];
            const item: MenuItem<T> = {
                value: action.value,
                isDisabled: action.isDisabled,
                isReachableWhenDisabled: action.isReachableWhenDisabled,
            };

            if (props.role === "menubar") return { ...item, items: access(props.actions)[index].items };

            return getPressedValues() === undefined ? item : { ...item, kind: PRESSED_ITEM_KIND };
        }),
    );

    const getHasOverflow = createMemo(() => getOverflowItems().length > 0);

    const getStops = createMemo(() =>
        getCut().shownIndexes.filter((index) => {
            const action = getActions()[index];

            return !action.isDisabled || action.isReachableWhenDisabled;
        }),
    );

    const getRovingStop = createMemo(() => {
        const stops = getStops();
        const focused = getFocusedStop();

        if (focused === OVERFLOW_STOP && getHasOverflow()) return focused;
        if (focused !== undefined && stops.includes(focused)) return focused;

        return stops[0] ?? (getHasOverflow() ? OVERFLOW_STOP : undefined);
    });

    const focusStop = (stop: number) => {
        setFocusedStop(stop);

        if (stop === OVERFLOW_STOP) getOverflowRef()?.focus();
        else getItemRefs()[stop]?.focus();
    };

    const createStopVisibility = (stop: number): SignalPair<boolean> => [
        () => getOpenStop() === stop,
        (isOpen) => setOpenStop((open) => (isOpen ? stop : open === stop ? undefined : open)),
    ];

    const overflowVisibility = createStopVisibility(OVERFLOW_STOP);

    createEffect(() => {
        const stops = getStops();
        const focused = getFocusedStop();

        if (focused === undefined || focused === OVERFLOW_STOP || stops.includes(focused)) return;

        const hadFocus = getItemRefs()[focused]?.contains(document.activeElement);
        const landing = getHasOverflow() ? OVERFLOW_STOP : stops[0];

        setFocusedStop(landing);

        if (!hadFocus || landing === undefined) return;

        focusStop(landing);
    });

    createEffect(() => {
        const open = getOpenStop();

        if (open === undefined) return;
        if (open === OVERFLOW_STOP ? getHasOverflow() : getStops().includes(open)) return;

        setOpenStop(undefined);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.defaultPrevented) return;

        const isFromRow = e.target instanceof Node && (getRootRef()?.contains(e.target) ?? false);
        const openStop = props.role === "menubar" ? getOpenStop() : undefined;

        if (!isFromRow && (openStop === undefined || !MENU_SWITCH_KEYS.includes(e.key))) return;

        const stops = [...getStops(), ...(getHasOverflow() ? [OVERFLOW_STOP] : [])];
        const from = stops.indexOf(openStop ?? getRovingStop() ?? stops[0]);

        if (stops.length < 2 || from < 0) return;

        const position = NavigatorUtils.computeNextPosition(e.key, from, stops.length, {
            orientation: getLayout() === undefined ? HORIZONTAL_ORIENTATION : PLACED_ORIENTATION,
            direction: getLayout() === undefined ? getDirection() : undefined,
        });

        if (position === undefined) return;

        e.preventDefault();

        const next = stops[position];

        if (openStop === undefined) {
            focusStop(next);

            return;
        }

        setOpenStop(undefined);
        focusStop(next);
        setOpenStop(next);
    };

    const pressAction = (buttonProps: ToolbarButtonsProps<T>, value: T) => {
        const pressedValuesSignal = buttonProps.pressedValuesSignal;

        if (pressedValuesSignal) {
            pressedValuesSignal[1](
                MenuUtils.computeNextChecked(
                    pressedValuesSignal[0](),
                    { value, kind: PRESSED_ITEM_KIND },
                    NO_RADIO_GROUP,
                ),
            );
        }

        props.onActivate(value);
    };

    const getSizingAt = (index: number) => (getPlacementAt(index) === undefined ? ROW_SIZING : PLACED_SIZING);

    const renderButton = (
        buttonProps: ToolbarButtonsProps<T>,
        getAction: Accessor<ToolbarAction<T>>,
        index: number,
    ) => (
        <InteractionWrapper
            sizing={getSizingAt(index)}
            isDisabled={() => getAction().isDisabled ?? false}
            isFocusableWhenDisabled={() => getAction().isReachableWhenDisabled ?? false}
            isPressed={getPressedValues()?.includes(getAction().value)}
            isTabbable={() => index === getRovingStop()}
            ref={(element) => setItemRef(index, element)}
            onActivation={() => pressAction(buttonProps, getAction().value)}
            renderControl={(setElementRef, getFlags) => (
                <button
                    type="button"
                    ref={setElementRef}
                    class={styles.toolbarButton}
                    aria-disabled={getFlags().isDisabled || undefined}
                    aria-pressed={getFlags().isPressed}
                >
                    {buttonProps.renderAction(getAction, getFlags)}
                </button>
            )}
        />
    );

    const renderWord = (menuProps: ToolbarMenusProps<T>, index: number) => {
        const getWord = () => access(menuProps.actions)[index];
        const visibility = createStopVisibility(index);

        return (
            <Menu
                items={() => getWord().items}
                sizing={getSizingAt(index)}
                isDisabled={() => getWord().isDisabled ?? false}
                isFocusableWhenDisabled={() => getWord().isReachableWhenDisabled ?? false}
                isTabbable={() => index === getRovingStop()}
                visibilitySignal={visibility}
                checkedSignal={menuProps.checkedSignal}
                submenuOffset={menuProps.submenuOffset}
                triggerRole={WORD_ROLE}
                ref={(element) => setItemRef(index, element)}
                renderContent={(getFlags) => menuProps.renderAction(getWord, getFlags)}
                renderItem={menuProps.renderItem}
                renderPopup={menuProps.renderPopup}
                onActivate={props.onActivate}
            />
        );
    };

    const renderControl = (getAction: Accessor<ToolbarAction<T>>, index: number) =>
        props.role === "menubar" ? renderWord(props, index) : renderButton(props, getAction, index);

    const renderActionAt = (getAction: Accessor<ToolbarAction<T>>, index: number) => (
        <Show
            when={getPlacementAt(index)}
            fallback={
                <div
                    class={[styles.toolbarItem, getIsShown(index) ? "" : styles.toolbarMeasuredItem].join(" ")}
                    role="presentation"
                    aria-hidden={getIsShown(index) ? undefined : "true"}
                    inert={getIsShown(index) ? undefined : true}
                >
                    {renderControl(getAction, index)}
                </div>
            }
        >
            {(getRect) => <PlacementItem placement={getRect}>{renderControl(getAction, index)}</PlacementItem>}
        </Show>
    );

    const renderItems = (children: JSX.Element) => (
        <Show when={getLayout()} fallback={children}>
            {(getResolved) => (
                <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                    {children}
                </PlacementBox>
            )}
        </Show>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.toolbarRoot}
            style={{ gap: `${getGap()}px`, visibility: getHasMeasured() ? undefined : "hidden" }}
            role={props.role}
            aria-label={access(props.ariaLabel)}
            onKeyDown={handleKeyDown}
        >
            {renderItems(<Index each={getActions()}>{renderActionAt}</Index>)}

            <div
                class={[styles.toolbarItem, getHasOverflow() ? "" : styles.toolbarMeasuredItem].join(" ")}
                role="presentation"
                aria-hidden={getHasOverflow() ? undefined : "true"}
                inert={getHasOverflow() ? undefined : true}
            >
                <Menu
                    items={getOverflowItems}
                    ariaLabel={props.overflowAriaLabel}
                    isTabbable={() => getRovingStop() === OVERFLOW_STOP}
                    visibilitySignal={overflowVisibility}
                    checkedSignal={props.role === "menubar" ? props.checkedSignal : props.pressedValuesSignal}
                    submenuOffset={props.role === "menubar" ? props.submenuOffset : undefined}
                    triggerRole={props.role === "menubar" ? WORD_ROLE : undefined}
                    ref={setOverflowRef}
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
