import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal } from "solid-js";

import {
    type InteractionSizing,
    type MenuItemKind,
    type MenuTriggerRole,
    MenuUtils,
    TOOLBAR_DEFAULTS,
    type ToolbarAction,
    ToolbarUtils,
    ToolbarStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { SignalPair } from "../../Utils/typeUtils";
import { Menu } from "../Menus/Menu/Menu";
import type { MenuItem } from "../Menus/Menu/MenuSolid.types";
import type { ToolbarButtonsProps, ToolbarCompositeProps, ToolbarMenusProps, ToolbarProps } from "./ToolbarSolid.types";

const OVERFLOW_STOP = ToolbarUtils.OVERFLOW_STOP;
const NO_RADIO_GROUP: never[] = [];
const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";
const PRESSED_ITEM_KIND: MenuItemKind = "checkbox";
const WORD_ROLE: MenuTriggerRole = "menuitem";

export const ToolbarComposite = <T,>(props: ToolbarCompositeProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getOverflowRef, setOverflowRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getFocusedStop, setFocusedStop] = createSignal<number>();
    const [getOpenStop, setOpenStop] = createSignal<number>();

    const getGap = createMemo(() => access(props.gap) ?? TOOLBAR_DEFAULTS.gap);

    const getActions = createMemo((): ToolbarAction<T>[] => access(props.actions));

    const getPressedValues = createMemo(() =>
        props.role === "toolbar" ? props.pressedValues?.[0]() : undefined,
    );

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getActions().length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getRootSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getItemSizes = ElementObserverSolidUtils.createBorderBoxSizeListObserver(getItemRefs);

    const getOverflowSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getOverflowRef);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const setItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((previous) => {
            const next = [...previous];

            next[index] = element;

            return next;
        });
    };

    const getHasMeasured = createMemo(() =>
        ToolbarUtils.computeHasMeasured(
            getLayout() !== undefined,
            getRootSize().width,
            getItemSizes().length,
            getActions().length,
        ),
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
            : ToolbarUtils.computeUncut(getActions().length),
    );

    const getIsShown = (index: number) => getCut().shownIndexes.includes(index);

    const getOverflowItems = createMemo((): MenuItem<T>[] =>
        ToolbarUtils.computeOverflowItems<T, MenuItem<T>>(
            props.role === "menubar" ? access(props.actions) : getActions(),
            getCut().collapsedIndexes,
            { hasSubmenus: props.role === "menubar", isPressable: getPressedValues() !== undefined },
        ),
    );

    const getHasOverflow = createMemo(() => getOverflowItems().length > 0);

    const getStops = createMemo(() => ToolbarUtils.computeStops(getActions(), getCut().shownIndexes));

    const getRovingStop = createMemo(() =>
        ToolbarUtils.computeRovingStop(getStops(), getFocusedStop(), getHasOverflow()),
    );

    const focusStop = (stop: number) => {
        setFocusedStop(stop);

        if (stop === OVERFLOW_STOP) getOverflowRef()?.focus();
        else getItemRefs()[stop]?.focus();
    };

    const createStopVisibility = (stop: number): SignalPair<boolean> => [
        () => getOpenStop() === stop,
        (isOpen) => setOpenStop((open) => ToolbarUtils.computeNextOpenStop(open, stop, isOpen)),
    ];

    const overflowVisibility = createStopVisibility(OVERFLOW_STOP);

    createEffect(() => {
        const focused = getFocusedStop();
        const step = ToolbarUtils.computeFocusLanding(getStops(), focused, getHasOverflow());

        if (focused === undefined || step === undefined) return;

        const hadFocus = getItemRefs()[focused]?.contains(document.activeElement);
        const landing = step.landing;

        setFocusedStop(landing);

        if (!hadFocus || landing === undefined) return;

        focusStop(landing);
    });

    createEffect(() => {
        const open = getOpenStop();

        if (open === undefined) return;
        if (ToolbarUtils.getIsStopPresent(open, getStops(), getHasOverflow())) return;

        setOpenStop(undefined);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.defaultPrevented) return;

        const step = ToolbarUtils.computeKeyStep(e.key, {
            isFromRow: e.target instanceof Node && (getRootRef()?.contains(e.target) ?? false),
            stops: getStops(),
            hasOverflow: getHasOverflow(),
            openStop: props.role === "menubar" ? getOpenStop() : undefined,
            rovingStop: getRovingStop(),
            isPlaced: getLayout() !== undefined,
            direction: getDirection(),
        });

        if (step === undefined) return;

        e.preventDefault();

        const next = step.stop;

        if (!step.isSwitch) {
            focusStop(next);

            return;
        }

        setOpenStop(undefined);
        focusStop(next);
        setOpenStop(next);
    };

    const pressAction = (buttonProps: ToolbarButtonsProps<T>, value: T) => {
        const pressedValuesSignal = buttonProps.pressedValues;

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
                visibility={visibility}
                checked={menuProps.checked}
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
            onFocusIn={(e) => {
                const stop = ToolbarUtils.computeStopAt(e.target, getItemRefs(), getOverflowRef());

                if (stop !== undefined) setFocusedStop(stop);
            }}
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
                    visibility={overflowVisibility}
                    checked={props.role === "menubar" ? props.checked : props.pressedValues}
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
