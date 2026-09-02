import { Index, createEffect, createMemo, createSignal } from "solid-js";

import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { access } from "../../Utils/propUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import { Menu } from "../Menu/Menu";
import type { MenuItem } from "../Menu/Menu.types";
import type { ToolbarProps } from "./Toolbar.types";
import { ToolbarUtils } from "./Toolbar.utils";

import * as styles from "./Toolbar.css";

const DEFAULT_TOOLBAR_GAP = 0;
const OVERFLOW_STOP = -1;
const NO_WIDTH = 0;

export const Toolbar = <T,>(props: ToolbarProps<T>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getOverflowRef, setOverflowRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getFocusedStop, setFocusedStop] = createSignal<number>();

    const getGap = createMemo(() => access(props.gap) ?? DEFAULT_TOOLBAR_GAP);

    const getActions = createMemo(() => access(props.actions));

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
        () => getRootSize().width > NO_WIDTH && getItemSizes().length === getActions().length,
    );

    const getCut = createMemo(() =>
        ToolbarUtils.computeCut({
            widths: getItemSizes().map((size) => size.width),
            collapses: getActions().map((action) => action.collapse ?? "auto"),
            available: getRootSize().width,
            overflowWidth: getOverflowSize().width,
            gap: getGap(),
        }),
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

        const position = NavigatorUtils.computeNextPosition(e.key, from, stops.length, { orientation: "row" });

        if (position === undefined) return;

        e.preventDefault();

        const next = stops[position];

        setFocusedStop(next);

        if (next === OVERFLOW_STOP) getOverflowRef()?.focus();
        else getItemRefs()[next]?.focus();
    };

    return (
        <div
            ref={setRootRef}
            class={styles.toolbarRoot}
            style={{ gap: `${getGap()}px`, visibility: getHasMeasured() ? undefined : "hidden" }}
            role="toolbar"
            aria-label={access(props.ariaLabel)}
            onKeyDown={handleKeyDown}
        >
            <Index each={getActions()}>
                {(getAction, index) => (
                    <div
                        class={[styles.toolbarItem, getIsShown(index) ? "" : styles.toolbarMeasuredItem].join(" ")}
                        role="presentation"
                        aria-hidden={getIsShown(index) ? undefined : "true"}
                        inert={getIsShown(index) ? undefined : true}
                    >
                        <InteractionWrapper
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
                    </div>
                )}
            </Index>

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
