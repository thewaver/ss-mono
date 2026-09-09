import { type Accessor, Index, type JSX, Show, createEffect, createMemo, createSignal } from "solid-js";

import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import type { NavigatorOrientation } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { PlacementBox, PlacementItem } from "../../Abstracts/Placement/Placement";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionSizing } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { access } from "../../Utils/propUtils";
import { Menu } from "../Menus/Menu/Menu";
import type { MenuItem } from "../Menus/Menu/Menu.types";
import type { ToolbarAction, ToolbarProps } from "./Toolbar.types";
import { ToolbarUtils } from "./Toolbar.utils";

import * as styles from "./Toolbar.css";

const DEFAULT_TOOLBAR_GAP = 0;
const OVERFLOW_STOP = -1;
const NO_WIDTH = 0;
const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";
const ROW_ORIENTATION: NavigatorOrientation = "row";
const PLACED_ORIENTATION: NavigatorOrientation = "both";

export const Toolbar = <T,>(props: ToolbarProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getOverflowRef, setOverflowRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getFocusedStop, setFocusedStop] = createSignal<number>();

    const getGap = createMemo(() => access(props.gap) ?? DEFAULT_TOOLBAR_GAP);

    const getActions = createMemo(() => access(props.actions));

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getActions().length }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getRootSize = ElementObserver.createBorderBoxSizeObserver(getRootRef);

    const getItemSizes = ElementObserver.createBorderBoxSizeListObserver(getItemRefs);

    const getOverflowSize = ElementObserver.createBorderBoxSizeObserver(getOverflowRef);

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

    /**
     * A layout sizes the toolbar itself, so there is no width left over to run out of and nothing to
     * collapse: every action is placed, and the overflow menu that a row needs has nothing to hold.
     */
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
        getCut().collapsedIndexes.map((index) => ({
            value: getActions()[index].value,
            isDisabled: getActions()[index].isDisabled,
        })),
    );

    const getHasOverflow = createMemo(() => getOverflowItems().length > 0);

    const getStops = createMemo(() => getCut().shownIndexes.filter((index) => !getActions()[index].isDisabled));

    const getRovingStop = createMemo(() => {
        const stops = getStops();
        const focused = getFocusedStop();

        if (focused === OVERFLOW_STOP && getHasOverflow()) return focused;
        if (focused !== undefined && stops.includes(focused)) return focused;

        return stops[0] ?? (getHasOverflow() ? OVERFLOW_STOP : undefined);
    });

    createEffect(() => {
        const stops = getStops();
        const focused = getFocusedStop();

        if (focused === undefined || focused === OVERFLOW_STOP || stops.includes(focused)) return;

        const hadFocus = getItemRefs()[focused]?.contains(document.activeElement);
        const landing = getHasOverflow() ? OVERFLOW_STOP : stops[0];

        setFocusedStop(landing);

        if (!hadFocus) return;

        if (landing === OVERFLOW_STOP) getOverflowRef()?.focus();
        else if (landing !== undefined) getItemRefs()[landing]?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const stops = [...getStops(), ...(getHasOverflow() ? [OVERFLOW_STOP] : [])];
        const from = stops.indexOf(getRovingStop() ?? stops[0]);

        if (stops.length < 2 || from < 0) return;

        const position = NavigatorUtils.computeNextPosition(e.key, from, stops.length, {
            orientation: getLayout() === undefined ? ROW_ORIENTATION : PLACED_ORIENTATION,
        });

        if (position === undefined) return;

        e.preventDefault();

        const next = stops[position];

        setFocusedStop(next);

        if (next === OVERFLOW_STOP) getOverflowRef()?.focus();
        else getItemRefs()[next]?.focus();
    };

    const renderControl = (getAction: Accessor<ToolbarAction<T>>, index: number) => (
        <InteractionWrapper
            sizing={getPlacementAt(index) === undefined ? ROW_SIZING : PLACED_SIZING}
            isDisabled={() => getAction().isDisabled ?? false}
            isTabbable={() => index === getRovingStop()}
            ref={(element) => setItemRef(index, element)}
            onActivation={() => props.onActivate(getAction().value)}
            renderControl={(setElementRef, getFlags) => (
                <button
                    type="button"
                    ref={setElementRef}
                    class={styles.toolbarButton}
                    aria-disabled={getFlags().isDisabled || undefined}
                >
                    {props.renderAction(getAction, getFlags)}
                </button>
            )}
        />
    );

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
            {(getResolved) => <PlacementBox layout={getResolved}>{children}</PlacementBox>}
        </Show>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.toolbarRoot}
            style={{ gap: `${getGap()}px`, visibility: getHasMeasured() ? undefined : "hidden" }}
            role="toolbar"
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
                    ref={setOverflowRef}
                    renderContent={props.renderOverflowTrigger}
                    renderItem={props.renderOverflowItem}
                    renderPopup={props.renderOverflowPopup}
                    onActivate={props.onActivate}
                />
            </div>
        </div>
    );
};
