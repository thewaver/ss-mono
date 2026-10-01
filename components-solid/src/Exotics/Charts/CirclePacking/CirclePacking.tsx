import { For, Show, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    CIRCLE_PACKING_DEFAULTS,
    type CirclePackingCircle,
    type CirclePackingCircleState,
    type CirclePackingNode,
    CirclePackingUtils,
    type CirclePackingView,
    TreemapUtils,
    CirclePackingStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { CirclePackingProps } from "./CirclePackingSolid.types";

const NOTHING = 0;
const HALF = 0.5;
const EMPTY_CIRCLE: CirclePackingCircle = { x: 0, y: 0, radius: 0 };

export const CirclePacking = <T,>(props: CirclePackingProps<T>) => {
    const circleRefs = new Map<CirclePackingNode<T>, SVGGElement>();

    let cameFrom: CirclePackingNode<T> | undefined;
    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    onCleanup(zoomClock.stop);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<CirclePackingNode<T>>();
    const getProgress = accessStore(zoomClock);
    const [getPath, setPath] = createSignal<(progress: number) => CirclePackingView>();

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getSide = createMemo(() => Math.min(getSize().width, getSize().height));

    const getPadding = createMemo(() => access(props.padding) ?? CIRCLE_PACKING_DEFAULTS.padding);

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getLayout = createMemo(() =>
        CirclePackingUtils.computeLayout(getRootNode(), getWeights(), getSide(), getPadding()),
    );

    const getNodes = createMemo(() => CirclePackingUtils.listNodes(getRootNode(), getLayout()));

    const [getHeldBranch, setHeldBranch] = SignalMirrorSolidUtils.createOptional(
        () => props.branch,
        untrack(getRootNode),
    );

    const getBranch = createMemo(() => TreemapUtils.resolveBranch(getHeldBranch(), getRootNode(), getWeights()));

    const getDepths = createMemo(() => CirclePackingUtils.computeDepths(getRootNode()));

    const getTargetView = createMemo(() => CirclePackingUtils.toView(getLayout().get(getBranch()) ?? EMPTY_CIRCLE));

    const getView = createMemo(() => CirclePackingUtils.computeShownView(getPath(), getTargetView(), getProgress()));

    const getIsInView = (node: CirclePackingNode<T>) => getBranch().children?.includes(node) ?? false;

    const getStops = createMemo(() =>
        getNodes().filter((node) => getIsInView(node) && TreemapUtils.getIsBranch(node, getWeights())),
    );

    const getRovingNode = createMemo(() => TreemapUtils.resolveStop(getFocusedNode(), getStops()));

    const computeState = (node: CirclePackingNode<T>): CirclePackingCircleState => ({
        ...CirclePackingUtils.project(getLayout().get(node) ?? EMPTY_CIRCLE, getView(), getSide()),
        weight: getWeights().get(node) ?? NOTHING,
        isBranch: TreemapUtils.getIsBranch(node, getWeights()),
        isInView: getIsInView(node),
        depth: getDepths().get(node) ?? NOTHING,
    });

    createComputed(
        on(getBranch, (next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            const from = untrack(() =>
                CirclePackingUtils.computeShownView(
                    getPath(),
                    CirclePackingUtils.toView(getLayout().get(previous) ?? EMPTY_CIRCLE),
                    getProgress(),
                ),
            );

            setPath(() =>
                CirclePackingUtils.interpolateZoom(
                    from,
                    CirclePackingUtils.toView(untrack(getLayout).get(next) ?? EMPTY_CIRCLE),
                ),
            );
            zoomClock.start(untrack(getZoomDurationMs));
        }),
    );

    const zoomTo = (node: CirclePackingNode<T>) => {
        if (node === getBranch()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldBranch(() => node);
    };

    const focusNode = (node: CirclePackingNode<T>) => {
        setFocusedNode(() => node);
        circleRefs.get(node)?.focus();
    };

    createEffect(
        on(getBranch, () => {
            if (!isFocusPending) return;

            isFocusPending = false;

            const target = TreemapUtils.resolveStop(cameFrom, getStops());

            if (target !== undefined) focusNode(target);
            else getRootRef()?.focus();
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(getRootNode(), getBranch());

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (from === undefined || e.target !== circleRefs.get(from)) return;

        const action = TreemapUtils.computeKeyAction(e.key, from, getStops());

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
    };

    return (
        <div
            ref={setRootRef}
            class={styles.circlePackingRoot}
            tabindex={-1}
            onKeyDown={handleKeyDown}
            onClick={() => zoomTo(getRootNode())}
        >
            <svg
                class={styles.circlePackingCanvas}
                viewBox={`${-getSize().width * HALF} ${-getSize().height * HALF} ${getSize().width} ${getSize().height}`}
                role="list"
                aria-label={access(props.ariaLabel)}
            >
                <For each={getNodes()}>
                    {(node) => {
                        const getIsBranch = createMemo(() => TreemapUtils.getIsBranch(node, getWeights()));
                        const getIsNodeInView = createMemo(() => getIsInView(node));
                        const getState = () => computeState(node);

                        onCleanup(() => circleRefs.delete(node));

                        return (
                            <g
                                role="listitem"
                                class={getIsBranch() ? undefined : styles.circlePackingLeaf}
                                aria-hidden={getIsNodeInView() ? undefined : "true"}
                            >
                                <g
                                    ref={(element) => circleRefs.set(node, element)}
                                    class={styles.circlePackingCircle}
                                    role={getIsBranch() && getIsNodeInView() ? "button" : undefined}
                                    tabindex={
                                        getIsBranch() && getIsNodeInView()
                                            ? node === getRovingNode()
                                                ? 0
                                                : -1
                                            : undefined
                                    }
                                    onClick={(e) => {
                                        if (!getIsBranch() || node === getBranch()) return;

                                        e.stopPropagation();
                                        setFocusedNode(() => node);
                                        zoomTo(node);
                                    }}
                                >
                                    {props.renderCircle(() => node, getState)}
                                </g>
                            </g>
                        );
                    }}
                </For>

                <Show when={props.renderLabel}>
                    {(getRenderLabel) => (
                        <g class={styles.circlePackingLabels} aria-hidden="true">
                            <For each={getNodes()}>
                                {(node) =>
                                    getRenderLabel()(
                                        () => node,
                                        () => computeState(node),
                                    )
                                }
                            </For>
                        </g>
                    )}
                </Show>
            </svg>
        </div>
    );
};
