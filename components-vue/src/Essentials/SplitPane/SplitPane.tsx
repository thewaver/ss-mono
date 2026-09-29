import { Fragment, type SlotsType, computed, defineComponent, shallowRef, useId, watch } from "vue";

import type { SplitPaneCollapsedBoundaries } from "@thewaver/ss-components";
import { SPLIT_PANE_DEFAULTS, SplitPaneStyles, SplitPaneUtils } from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { SplitPaneProps, SplitPaneSlots } from "./SplitPane.types";

const NO_GUTTER_DRAGGING = -1;
const PERCENT = 100;

export const SplitPane = defineComponent(
    (props: SplitPaneProps, { slots }: SlotsContext<SplitPaneSlots>) => {
        const storedRatios = useTwoWay(props, "ratios");

        const paneIdPrefix = useId();

        const rootRef = shallowRef<HTMLDivElement>();

        let hasDragged = false;

        const draggingIndex = shallowRef(NO_GUTTER_DRAGGING);
        const collapsedBoundaries = shallowRef<SplitPaneCollapsedBoundaries>({});

        const getOrientation = () => props.orientation ?? SPLIT_PANE_DEFAULTS.orientation;
        const getIsHorizontal = () => getOrientation() === "horizontal";
        const getGutterSize = () => props.gutterSize ?? SPLIT_PANE_DEFAULTS.gutterSize;
        const getKeyStep = () => props.keyStep ?? SPLIT_PANE_DEFAULTS.keyStep;
        const getIsDisabled = () => props.isDisabled ?? false;

        const paneCount = computed(() => props.panes.length);

        const ratios = computed(() => SplitPaneUtils.computeRatios(paneCount.value, storedRatios.value));

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);
        const direction = NavigatorVueUtils.useDirection(rootRef);

        const getAvailablePx = () =>
            (getIsHorizontal() ? rootSize.value.width : rootSize.value.height) -
            SplitPaneUtils.computeTotalGutterSize(getGutterSize(), paneCount.value);

        watch(ratios, (next) => {
            collapsedBoundaries.value = SplitPaneUtils.pruneCollapsed(collapsedBoundaries.value, next);
        });

        const getPaneId = (index: number) => props.panes[index]?.id ?? `${paneIdPrefix}-pane-${index}`;

        const getBoundary = (index: number) => SplitPaneUtils.computeBoundary(ratios.value, index);

        const computeBoundaryLimits = (index: number) =>
            SplitPaneUtils.computeBoundaryLimits({
                ratios: ratios.value,
                index,
                panes: props.panes,
                availablePx: getAvailablePx(),
            });

        const moveBoundary = (index: number, boundary: number) => {
            collapsedBoundaries.value = SplitPaneUtils.forgetCollapsed(collapsedBoundaries.value, index);

            const next = SplitPaneUtils.computeMovedRatios({
                ratios: ratios.value,
                index,
                boundary,
                panes: props.panes,
                availablePx: getAvailablePx(),
            });

            storedRatios.value = next;

            return next;
        };

        const toggleCollapsed = (index: number) => {
            const collapsed = collapsedBoundaries.value[index];

            if (collapsed !== undefined) {
                moveBoundary(index, collapsed.restore);

                return;
            }

            const restore = getBoundary(index);
            const next = moveBoundary(index, SplitPaneUtils.SMALLEST_BOUNDARY);
            const collapsedAt = SplitPaneUtils.computeBoundary(next, index);

            collapsedBoundaries.value = { ...collapsedBoundaries.value, [index]: { restore, collapsedAt } };
        };

        const handleGutterPointerDown = (e: PointerEvent, index: number) => {
            if (e.button !== 0 || getIsDisabled()) return;

            e.preventDefault();

            hasDragged = false;

            (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
            draggingIndex.value = index;
        };

        const handleGutterPointerMove = (e: PointerEvent, index: number) => {
            const root = rootRef.value;

            if (draggingIndex.value !== index || !root) return;

            const boundary = SplitPaneUtils.computePointerBoundary({
                point: e,
                rootRect: root.getBoundingClientRect(),
                index,
                orientation: getOrientation(),
                direction: direction.value,
                gutterSize: getGutterSize(),
                paneCount: paneCount.value,
            });

            if (boundary === undefined) return;

            hasDragged = true;

            moveBoundary(index, boundary);
        };

        const handleGutterPointerUp = (e: PointerEvent, index: number) => {
            if (draggingIndex.value !== index) return;

            const gutter = e.currentTarget as HTMLButtonElement;

            gutter.releasePointerCapture(e.pointerId);
            draggingIndex.value = NO_GUTTER_DRAGGING;

            if (hasDragged) return;

            moveBoundary(
                index,
                SplitPaneUtils.computePressBoundary({
                    point: e,
                    gutterRect: gutter.getBoundingClientRect(),
                    orientation: getOrientation(),
                    direction: direction.value,
                    boundary: getBoundary(index),
                    step: getKeyStep(),
                }),
            );
        };

        const handleGutterPointerCancel = (index: number) => {
            if (draggingIndex.value !== index) return;

            draggingIndex.value = NO_GUTTER_DRAGGING;
        };

        const handleGutterKeyDown = (e: KeyboardEvent, index: number) => {
            if (getIsDisabled()) return;

            const action = SplitPaneUtils.computeKeyAction(e.key, getOrientation(), direction.value);

            if (!action) return;

            e.preventDefault();

            if (action === "toggle") {
                toggleCollapsed(index);

                return;
            }

            if (action === "home" || action === "end") {
                moveBoundary(
                    index,
                    action === "home" ? SplitPaneUtils.SMALLEST_BOUNDARY : SplitPaneUtils.LARGEST_BOUNDARY,
                );

                return;
            }

            moveBoundary(index, getBoundary(index) + (action === "decrease" ? -getKeyStep() : getKeyStep()));
        };

        return () => {
            const isHorizontal = getIsHorizontal();
            const isDisabled = getIsDisabled();
            const template = SplitPaneUtils.computeTemplate(props.panes, ratios.value, getGutterSize());

            return (
                <div
                    ref={rootRef}
                    class={SplitPaneStyles.splitPaneRoot}
                    style={isHorizontal ? { gridTemplateColumns: template } : { gridTemplateRows: template }}
                    role="group"
                    aria-label={props.ariaLabel}
                >
                    {props.panes.map((pane, index) => {
                        const limits = index > 0 ? computeBoundaryLimits(index - 1) : undefined;

                        return (
                            <Fragment key={index}>
                                {limits && (
                                    <button
                                        type="button"
                                        class={SplitPaneStyles.splitPaneGutter}
                                        role="separator"
                                        tabindex={isDisabled ? -1 : 0}
                                        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
                                        aria-controls={getPaneId(index - 1)}
                                        aria-label={props.panes[index - 1].gutterAriaLabel}
                                        aria-disabled={isDisabled || undefined}
                                        aria-valuenow={Math.round(getBoundary(index - 1) * PERCENT)}
                                        aria-valuemin={Math.round(limits.floor * PERCENT)}
                                        aria-valuemax={Math.round(limits.ceiling * PERCENT)}
                                        onPointerdown={(e) => handleGutterPointerDown(e, index - 1)}
                                        onPointermove={(e) => handleGutterPointerMove(e, index - 1)}
                                        onPointerup={(e) => handleGutterPointerUp(e, index - 1)}
                                        onPointercancel={() => handleGutterPointerCancel(index - 1)}
                                        onKeydown={(e) => handleGutterKeyDown(e, index - 1)}
                                    >
                                        {callSlot(slots.renderGutter, {
                                            isDragging: draggingIndex.value === index - 1,
                                            isDisabled,
                                        })}
                                    </button>
                                )}

                                <div id={getPaneId(index)} class={SplitPaneStyles.splitPanePane}>
                                    {callSlot(slots.renderPane, { pane, index })}
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "SplitPane",
        slots: Object as SlotsType<SplitPaneSlots>,
        props: declareProps<SplitPaneProps>({
            "orientation": null,
            "gutterSize": null,
            "keyStep": null,
            "ariaLabel": null,
            "isDisabled": Boolean,
            "panes": null,
            "ratios": null,
            "onUpdate:ratios": null,
        }),
    },
);
