import {
    For,
    Index,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketNode,
    type BracketPlacement,
    BracketUtils,
    NavigatorUtils,
    PanZoomUtils,
    BracketStyles as styles,
} from "@thewaver/ss-components";
import { BracketConst } from "@thewaver/ss-components/internal";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { PanZoomSolidUtils } from "../../../Abstracts/PanZoom/PanZoomSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { BracketProps } from "./BracketSolid.types";

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = createUniqueId();

    const [getNodeRefs, setNodeRefs] = createSignal<Record<string, HTMLElement | undefined>>({});
    const [getLastFocusedId, setLastFocusedId] = createSignal<string>();
    const [getHasFocus, setHasFocus] = createSignal(false);
    const [getWindowRef, setWindowRef] = createSignal<HTMLElement>();

    const getWindowSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getWindowRef);

    const getRootNode = createMemo(() => access(props.root));

    const getLayout = createMemo(() => BracketUtils.computeLayout(getRootNode()));

    const getNodeSize = createMemo(() => access(props.nodeSize));

    const getOrientation = createMemo(() => access(props.orientation) ?? BRACKET_DEFAULTS.orientation);

    const getRootSide = createMemo(() => access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide);

    const getGeometry = createMemo(() =>
        BracketUtils.computeGeometry(getLayout(), {
            nodeSize: getNodeSize(),
            layerGap: access(props.layerGap) ?? BRACKET_DEFAULTS.layerGap,
            crossGap: access(props.crossGap) ?? BRACKET_DEFAULTS.crossGap,
            orientation: getOrientation(),
            rootSide: getRootSide(),
            headerExtent: props.renderLayerHeader
                ? (access(props.layerHeaderSize) ?? BRACKET_DEFAULTS.layerHeaderSize)
                : BracketConst.NOTHING,
        }),
    );

    const getBoardSize = createMemo(() => getGeometry().boardSize);

    const getIsPannable = createMemo(() => access(props.isPannable) ?? BRACKET_DEFAULTS.isPannable);

    const getIsZoomable = createMemo(() => access(props.isZoomable) ?? BRACKET_DEFAULTS.isZoomable);

    const panZoom = PanZoomSolidUtils.create({
        getSource: () => props.view,
        getWindowRef,
        getSize: getWindowSize,
        getRange: () => BracketUtils.computeWholeView(getGeometry()),
        getMinWidth: () => getWindowSize().width / (access(props.maxScale) ?? BRACKET_DEFAULTS.maxScale),
        getDurationMs: () => access(props.transitionDurationMs) ?? BRACKET_DEFAULTS.transitionDurationMs,
        getIsPannable,
        getIsZoomable,
        getCanCenterEdges: (requested) =>
            (access(props.isFollowingFamily) ?? BRACKET_DEFAULTS.isFollowingFamily) &&
            getWindowSize().width > BracketConst.NOTHING &&
            BracketUtils.computeFamilyInView(
                getLayout(),
                getGeometry(),
                requested,
                getWindowSize().height / getWindowSize().width,
                access(props.familyMargin) ?? BRACKET_DEFAULTS.familyMargin,
            ) !== undefined,
        onGestureMove: () => followView(),
        onSettle: () => snapToFamily(),
    });

    onMount(() => {
        props.onMount?.(panZoom.controller);
    });

    const getBoardTransform = createMemo(() => {
        if (!panZoom.getIsActive()) return undefined;

        const view = panZoom.getShownView();
        const scale = PanZoomUtils.computeScale(view, getWindowSize().width);

        return `scale(${scale}) translate(${-view.x.start}px, ${-view.y.start}px)`;
    });

    const getFocusedId = createMemo(() => (getHasFocus() ? getLastFocusedId() : undefined));

    const [getFamily, setFamily] = SignalMirrorSolidUtils.createOptional<BracketNode<T> | undefined>(
        () => props.family,
        undefined,
    );

    const getAnchorId = createMemo(() => BracketUtils.findNodeId(getRootNode(), getLayout(), getFamily()));

    const getCurrentLayer = createMemo(() => BracketUtils.getFamilyLayer(getLayout(), getAnchorId()));

    const getIsFollowingFamily = createMemo(
        () => panZoom.getIsActive() && (access(props.isFollowingFamily) ?? BRACKET_DEFAULTS.isFollowingFamily),
    );

    const getFamilyMargin = createMemo(() => access(props.familyMargin) ?? BRACKET_DEFAULTS.familyMargin);

    const computeFamilyInView = () =>
        BracketUtils.computeFamilyInView(
            getLayout(),
            getGeometry(),
            panZoom.getView(),
            panZoom.getAspect(),
            getFamilyMargin(),
        );

    const getIsFamilyFramed = createMemo(() => !getIsFollowingFamily() || computeFamilyInView() !== undefined);

    let followedFamily: { anchorId: string | undefined } | undefined;

    const setFamilyByAnchor = (anchorId: string | undefined) => {
        setFamily(() => (anchorId === undefined ? undefined : BracketUtils.findNode(getRootNode(), anchorId)));
    };

    const frameFamily = (anchorId: string | undefined) => {
        panZoom.setView(BracketUtils.computeFamilyView(getLayout(), getGeometry(), anchorId, getFamilyMargin()), false);
    };

    const followView = () => {
        if (!untrack(getIsFollowingFamily)) return;

        const inView = untrack(computeFamilyInView);

        if (inView === undefined || inView.anchorId === untrack(getAnchorId)) return;

        followedFamily = inView;
        setFamilyByAnchor(inView.anchorId);
    };

    const snapToFamily = () => {
        if (
            !untrack(getIsFollowingFamily) ||
            !(access(props.isSnappingToFamily) ?? BRACKET_DEFAULTS.isSnappingToFamily)
        )
            return;

        const inView = untrack(computeFamilyInView);

        if (inView === undefined) {
            panZoom.setView(BracketUtils.computeWholeView(untrack(getGeometry)), false);

            return;
        }

        followView();
        frameFamily(inView.anchorId);
    };

    createEffect(
        on(
            [getGeometry, getWindowSize],
            (_current, previous) => {
                if (!untrack(getIsFollowingFamily) || previous === undefined) return;

                const [geometry, size] = previous;

                if (size.width <= BracketConst.NOTHING) return;

                const wasFramed =
                    BracketUtils.computeFamilyInView(
                        untrack(getLayout),
                        geometry,
                        untrack(panZoom.getRequestedView),
                        size.height / size.width,
                        untrack(getFamilyMargin),
                    ) !== undefined;

                if (wasFramed) frameFamily(untrack(getAnchorId));
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getAnchorId,
            (anchorId) => {
                const followed = followedFamily;

                followedFamily = undefined;

                if (!untrack(getIsFollowingFamily) || (followed !== undefined && followed.anchorId === anchorId))
                    return;

                frameFamily(anchorId);
            },
            { defer: true },
        ),
    );

    const showFamilyOf = (id: string) => {
        const anchorId = BracketUtils.getFamilyAnchorId(id);

        setFamily(() => (anchorId === undefined ? undefined : BracketUtils.findNode(getRootNode(), anchorId)));
    };

    const getInset = (placement: BracketPlacement) => BracketUtils.computeInset(getGeometry(), placement);

    const getHeaderBox = (layer: number) => {
        const box = BracketUtils.computeHeaderBox(getGeometry(), layer);

        if (!panZoom.getIsActive()) return box;

        const view = panZoom.getShownView();

        return getGeometry().isHorizontal ? { ...box, top: view.y.start } : { ...box, left: view.x.start };
    };

    const getConnectors = createMemo(() =>
        BracketUtils.computeConnectors(getLayout(), getGeometry(), boardId, getFocusedId()),
    );

    const getPlacementById = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.id, placement])),
    );

    const getNodeIds = createMemo(() => getLayout().placements.map((placement) => placement.id));

    const getLayers = createMemo(() => Array.from({ length: getLayout().layerCount }, (_unused, layer) => layer));

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getRovingId = createMemo(() => BracketUtils.resolveRovingId(getStops(), getLastFocusedId()));

    const getIsNode = (target: EventTarget | null) =>
        Object.values(getNodeRefs()).some((element) => element !== undefined && element === target);

    const setNodeRef = (id: string, element: HTMLElement) => {
        setNodeRefs((previous) => ({ ...previous, [id]: element }));

        onCleanup(() => {
            setNodeRefs((previous) => ({ ...previous, [id]: undefined }));
        });
    };

    const revealNode = (id: string) => {
        const placement = getPlacementById().get(id);

        if (!panZoom.getIsActive() || placement === undefined) return;

        const inset = getInset(placement);

        panZoom.controller.showArea({
            x: { start: inset.left, end: inset.left + getNodeSize().width },
            y: { start: inset.top, end: inset.top + getNodeSize().height },
        });
    };

    const activate = (id: string) => {
        props.onActivate?.(
            BracketUtils.findNode(getRootNode(), id).value,
            getPlacementById().get(id) ?? BRACKET_MISSING_PLACEMENT,
        );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingId();

        if (from === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(from);

            return;
        }

        const step = BracketUtils.getKeyStep(e.key, getOrientation(), getRootSide());

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, from, getStops());

        if (next === undefined) return;

        e.preventDefault();
        setLastFocusedId(next);
        getNodeRefs()[next]?.focus({ preventScroll: panZoom.getIsActive() });
    };

    const renderItem = (id: string) => {
        const getPlacement = createMemo(() => getPlacementById().get(id) ?? BRACKET_MISSING_PLACEMENT);
        const getIsNodeDisabled = () => getPlacement().isDisabled;

        return (
            <li
                class={styles.bracketItem}
                style={{
                    left: `${getInset(getPlacement()).left}px`,
                    top: `${getInset(getPlacement()).top}px`,
                    width: `${getNodeSize().width}px`,
                    height: `${getNodeSize().height}px`,
                }}
            >
                <div
                    ref={(element) => setNodeRef(id, element)}
                    class={styles.bracketNode}
                    role="button"
                    tabindex={getIsNodeDisabled() ? undefined : id === getRovingId() ? 0 : -1}
                    aria-disabled={getIsNodeDisabled() || undefined}
                    onFocus={() => {
                        showFamilyOf(id);
                        setLastFocusedId(id);
                        setHasFocus(true);
                        revealNode(id);
                    }}
                    onBlur={(e) => {
                        if (getIsNode(e.relatedTarget)) return;

                        setHasFocus(false);
                    }}
                    onClick={() => {
                        if (getIsNodeDisabled()) return;

                        setLastFocusedId(id);
                        activate(id);
                    }}
                >
                    {props.renderNode(
                        () => BracketUtils.findNode(getRootNode(), id),
                        () => ({
                            placement: getPlacement(),
                            isFocused: getFocusedId() === id,
                            isOnFocusedRoute: BracketUtils.getIsOnRoute(id, getFocusedId()),
                        }),
                    )}
                </div>
            </li>
        );
    };

    const renderBoard = () => (
        <div
            class={styles.bracketRoot}
            style={{
                width: `${getBoardSize().width}px`,
                height: `${getBoardSize().height}px`,
                transform: getBoardTransform(),
            }}
            role={props.renderLayerHeader ? "group" : undefined}
            aria-label={props.renderLayerHeader ? access(props.ariaLabel) : undefined}
            onKeyDown={handleKeyDown}
        >
            <svg
                class={styles.bracketConnectors}
                viewBox={`0 0 ${getBoardSize().width} ${getBoardSize().height}`}
                aria-hidden="true"
            >
                <Index each={getConnectors()}>{(getDefs) => <>{props.renderConnector?.(getDefs)}</>}</Index>
            </svg>

            <Show
                when={props.renderLayerHeader}
                fallback={
                    <ul class={styles.bracketList} aria-label={access(props.ariaLabel)}>
                        <For each={getNodeIds()}>{renderItem}</For>
                    </ul>
                }
            >
                {(getRenderLayerHeader) => (
                    <For each={getLayers()}>
                        {(layer) => {
                            const headerId = `${boardId}-layer-${layer}`;
                            const getLayerNodeIds = createMemo(() =>
                                getLayout()
                                    .placements.filter((placement) => placement.layer === layer)
                                    .map((placement) => placement.id),
                            );

                            return (
                                <>
                                    <div
                                        id={headerId}
                                        class={styles.bracketLayerHeader}
                                        style={{
                                            "left": `${getHeaderBox(layer).left}px`,
                                            "top": `${getHeaderBox(layer).top}px`,
                                            "width": `${getHeaderBox(layer).width}px`,
                                            "height": `${getHeaderBox(layer).height}px`,
                                            "pointer-events": panZoom.getIsActive() ? "none" : undefined,
                                        }}
                                    >
                                        {getRenderLayerHeader()(layer, () => ({
                                            isCurrent: getIsFamilyFramed() && getCurrentLayer() === layer,
                                        }))}
                                    </div>

                                    <ul class={styles.bracketList} aria-labelledby={headerId}>
                                        <For each={getLayerNodeIds()}>{renderItem}</For>
                                    </ul>
                                </>
                            );
                        }}
                    </For>
                )}
            </Show>
        </div>
    );

    return (
        <Show when={panZoom.getIsActive()} fallback={renderBoard()}>
            <div
                ref={setWindowRef}
                class={styles.bracketWindow}
                style={{
                    "touch-action": getIsPannable() || getIsZoomable() ? "none" : undefined,
                    "user-select": getIsPannable() ? "none" : undefined,
                }}
                onPointerDown={(e) => panZoom.gestures.press(e)}
                onPointerMove={(e) => panZoom.gestures.move(e, e.currentTarget)}
                onPointerUp={(e) => panZoom.gestures.release(e, e.currentTarget)}
                onPointerCancel={(e) => panZoom.gestures.release(e, e.currentTarget)}
                onWheel={(e) => panZoom.gestures.wheel(e)}
                onScroll={(e) => {
                    e.currentTarget.scrollLeft = BracketConst.NOTHING;
                    e.currentTarget.scrollTop = BracketConst.NOTHING;
                }}
            >
                {renderBoard()}
            </div>
        </Show>
    );
};
