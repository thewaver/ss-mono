import { Fragment, type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketGeometry,
    type BracketNode,
    BracketUtils,
    NavigatorUtils,
    PanZoomUtils,
    type PanZoomView,
    BracketStyles as styles,
} from "@thewaver/ss-components";
import { BracketConst } from "@thewaver/ss-components/internal";
import { Size2d } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { PanZoomReactUtils } from "../../../Abstracts/PanZoom/PanZoomReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useElement } from "../../../Utils/refUtils";
import type { BracketProps } from "./Bracket.types";

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = useId();
    const nodeRefs = useRef(new Map<string, HTMLElement>());
    const windowRef = useRef<HTMLDivElement | null>(null);
    const isStepping = useRef(false);
    const followedFamily = useRef<{ anchorId: string | undefined }>(undefined);
    const previousGeometry = useRef<{ geometry: BracketGeometry; size: Size2d }>(undefined);

    const [lastFocusedId, setLastFocusedId] = useState<string>();
    const [hasFocus, setHasFocus] = useState(false);

    const windowSize = ElementObserverReactUtils.useBorderBoxSize(windowRef);
    const windowElement = useElement(windowRef);

    const orientation = props.orientation ?? BRACKET_DEFAULTS.orientation;
    const rootSide = props.rootSide ?? BRACKET_DEFAULTS.rootSide;
    const nodeWidth = props.nodeSize.width;
    const nodeHeight = props.nodeSize.height;
    const layerGap = props.layerGap ?? BRACKET_DEFAULTS.layerGap;
    const crossGap = props.crossGap ?? BRACKET_DEFAULTS.crossGap;
    const headerExtent = props.renderLayerHeader
        ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize)
        : BracketConst.NOTHING;
    const isPannable = props.isPannable ?? BRACKET_DEFAULTS.isPannable;
    const isZoomable = props.isZoomable ?? BRACKET_DEFAULTS.isZoomable;
    const isFollowingFamilyProp = props.isFollowingFamily ?? BRACKET_DEFAULTS.isFollowingFamily;
    const isSnappingToFamily = props.isSnappingToFamily ?? BRACKET_DEFAULTS.isSnappingToFamily;
    const familyMargin = props.familyMargin ?? BRACKET_DEFAULTS.familyMargin;

    const layout = useMemo(() => BracketUtils.computeLayout(props.root), [props.root]);

    const geometry = useMemo(
        () =>
            BracketUtils.computeGeometry(layout, {
                nodeSize: { width: nodeWidth, height: nodeHeight },
                layerGap,
                crossGap,
                orientation,
                rootSide,
                headerExtent,
            }),
        [layout, nodeWidth, nodeHeight, layerGap, crossGap, orientation, rootSide, headerExtent],
    );

    const boardSize = geometry.boardSize;

    const panZoom = PanZoomReactUtils.usePanZoom({
        source: props.view,
        windowRef,
        size: windowSize,
        range: BracketUtils.computeWholeView(geometry),
        minWidth: windowSize.width / (props.maxScale ?? BRACKET_DEFAULTS.maxScale),
        durationMs: props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs,
        isPannable,
        isZoomable,
        computeCanCenterEdges: (requested) =>
            isFollowingFamilyProp &&
            windowSize.width > BracketConst.NOTHING &&
            BracketUtils.computeFamilyInView(
                layout,
                geometry,
                requested,
                windowSize.height / windowSize.width,
                familyMargin,
            ) !== undefined,
        onGestureMove: () => followView(),
        onSettle: () => snapToFamily(),
    });

    useEffect(() => {
        props.onMount?.(panZoom.controller);
    }, [panZoom.controller]);

    const boardTransform = (() => {
        if (!panZoom.isActive) return undefined;

        const scale = PanZoomUtils.computeScale(panZoom.shownView, windowSize.width);

        return `scale(${scale}) translate(${-panZoom.shownView.x.start}px, ${-panZoom.shownView.y.start}px)`;
    })();

    const focusedId = hasFocus ? lastFocusedId : undefined;

    const [family, setFamily] = SignalMirrorReactUtils.useOptionalState<BracketNode<T> | undefined>(
        props.family,
        undefined,
    );

    const anchorId = useMemo(() => BracketUtils.findNodeId(props.root, layout, family), [props.root, layout, family]);

    const currentLayer = BracketUtils.getFamilyLayer(layout, anchorId);

    const isFollowingFamily = panZoom.isActive && isFollowingFamilyProp;

    const computeFamilyInView = (view: PanZoomView, aspect: number) =>
        BracketUtils.computeFamilyInView(layout, geometry, view, aspect, familyMargin);

    const computeLiveFamilyInView = () => computeFamilyInView(panZoom.getView(), panZoom.getAspect());

    const isFamilyFramed =
        !isFollowingFamily ||
        (windowSize.width > BracketConst.NOTHING &&
            computeFamilyInView(panZoom.view, windowSize.height / windowSize.width) !== undefined);

    const setFamilyByAnchor = (id: string | undefined) => {
        setFamily(id === undefined ? undefined : BracketUtils.findNode(props.root, id));
    };

    const frameFamily = (id: string | undefined) => {
        panZoom.setView(BracketUtils.computeFamilyView(layout, geometry, id, familyMargin), false);
    };

    const followView = () => {
        if (!isFollowingFamily) return;

        const inView = computeLiveFamilyInView();

        if (inView === undefined || inView.anchorId === anchorId) return;

        followedFamily.current = inView;
        setFamilyByAnchor(inView.anchorId);
    };

    const snapToFamily = () => {
        if (!isFollowingFamily || !isSnappingToFamily) return;

        const inView = computeLiveFamilyInView();

        if (inView === undefined) {
            panZoom.setView(BracketUtils.computeWholeView(geometry), false);

            return;
        }

        followView();
        frameFamily(inView.anchorId);
    };

    useEffect(() => {
        const previous = previousGeometry.current;

        previousGeometry.current = { geometry, size: windowSize };

        if (
            !isFollowingFamily ||
            previous === undefined ||
            (previous.geometry === geometry && Size2d.isSame(previous.size, windowSize)) ||
            previous.size.width <= BracketConst.NOTHING
        )
            return;

        const wasFramed =
            BracketUtils.computeFamilyInView(
                layout,
                previous.geometry,
                panZoom.getRequestedView(),
                previous.size.height / previous.size.width,
                familyMargin,
            ) !== undefined;

        if (wasFramed) frameFamily(anchorId);
    }, [geometry, windowSize]);

    const previousAnchorId = useRef(anchorId);

    useEffect(() => {
        if (previousAnchorId.current === anchorId) return;

        const followed = followedFamily.current;

        previousAnchorId.current = anchorId;
        followedFamily.current = undefined;

        if (!isFollowingFamily || (followed !== undefined && followed.anchorId === anchorId)) return;

        frameFamily(anchorId);
    }, [anchorId]);

    const showFamilyOf = (id: string) => {
        setFamilyByAnchor(BracketUtils.getFamilyAnchorId(id));
    };

    const getHeaderBox = (layer: number) => {
        const box = BracketUtils.computeHeaderBox(geometry, layer);

        if (!panZoom.isActive) return box;

        return geometry.isHorizontal
            ? { ...box, top: panZoom.shownView.y.start }
            : { ...box, left: panZoom.shownView.x.start };
    };

    const connectors = BracketUtils.computeConnectors(layout, geometry, boardId, focusedId);

    const placementById = useMemo(
        () => new Map(layout.placements.map((placement) => [placement.id, placement])),
        [layout],
    );

    const stops = layout.placements.filter((placement) => !placement.isDisabled);
    const rovingId = BracketUtils.resolveRovingId(stops, lastFocusedId);

    const getIsNode = (eventTarget: EventTarget | null) =>
        [...nodeRefs.current.values()].some((element) => element === eventTarget);

    const revealNode = (id: string) => {
        const placement = placementById.get(id);

        if (!panZoom.isActive || placement === undefined) return;

        const inset = BracketUtils.computeInset(geometry, placement);

        panZoom.controller.showArea({
            x: { start: inset.left, end: inset.left + nodeWidth },
            y: { start: inset.top, end: inset.top + nodeHeight },
        });
    };

    const activate = (id: string) => {
        props.onActivate?.(
            BracketUtils.findNode(props.root, id).value,
            placementById.get(id) ?? BRACKET_MISSING_PLACEMENT,
        );
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (rovingId === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(rovingId);

            return;
        }

        const step = BracketUtils.getKeyStep(e.key, orientation, rootSide);

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, rovingId, stops);

        if (next === undefined) return;

        e.preventDefault();
        isStepping.current = true;
        flushSync(() => {
            showFamilyOf(next);
            setLastFocusedId(next);
        });
        nodeRefs.current.get(next)?.focus({ preventScroll: panZoom.isActive });
        isStepping.current = false;
    };

    useEffect(() => {
        if (!windowElement) return;

        const handleWheel = (e: WheelEvent) => panZoom.gestures.wheel(e);

        windowElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => windowElement.removeEventListener("wheel", handleWheel);
    }, [windowElement, panZoom.gestures]);

    const renderItem = (id: string): ReactNode => {
        const placement = placementById.get(id) ?? BRACKET_MISSING_PLACEMENT;
        const isNodeDisabled = placement.isDisabled;
        const inset = BracketUtils.computeInset(geometry, placement);

        return (
            <li
                key={id}
                className={styles.bracketItem}
                style={{
                    left: `${inset.left}px`,
                    top: `${inset.top}px`,
                    width: `${nodeWidth}px`,
                    height: `${nodeHeight}px`,
                }}
            >
                <div
                    ref={(element) => {
                        if (element) nodeRefs.current.set(id, element);
                        else nodeRefs.current.delete(id);
                    }}
                    className={styles.bracketNode}
                    role="button"
                    tabIndex={isNodeDisabled ? undefined : id === rovingId ? 0 : -1}
                    aria-disabled={isNodeDisabled || undefined}
                    onFocus={(e) => {
                        if (e.target !== e.currentTarget) return;

                        showFamilyOf(id);
                        setLastFocusedId(id);
                        setHasFocus(true);
                        revealNode(id);
                    }}
                    onBlur={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (isStepping.current || getIsNode(e.relatedTarget)) return;

                        setHasFocus(false);
                    }}
                    onClick={() => {
                        if (isNodeDisabled) return;

                        setLastFocusedId(id);
                        activate(id);
                    }}
                >
                    {props.renderNode(BracketUtils.findNode(props.root, id), {
                        placement,
                        isFocused: focusedId === id,
                        isOnFocusedRoute: BracketUtils.getIsOnRoute(id, focusedId),
                    })}
                </div>
            </li>
        );
    };

    const renderLayerHeader = props.renderLayerHeader;

    const board = (
        <div
            className={styles.bracketRoot}
            style={{ width: `${boardSize.width}px`, height: `${boardSize.height}px`, transform: boardTransform }}
            role={renderLayerHeader ? "group" : undefined}
            aria-label={renderLayerHeader ? props.ariaLabel : undefined}
            onKeyDown={handleKeyDown}
        >
            <svg
                className={styles.bracketConnectors}
                viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
                aria-hidden="true"
            >
                {connectors.map((defs, index) => (
                    <Fragment key={index}>{props.renderConnector?.(defs)}</Fragment>
                ))}
            </svg>

            {renderLayerHeader ? (
                Array.from({ length: layout.layerCount }, (_unused, layer) => {
                    const headerId = `${boardId}-layer-${layer}`;
                    const headerBox = getHeaderBox(layer);

                    return (
                        <Fragment key={layer}>
                            <div
                                id={headerId}
                                className={styles.bracketLayerHeader}
                                style={{
                                    left: `${headerBox.left}px`,
                                    top: `${headerBox.top}px`,
                                    width: `${headerBox.width}px`,
                                    height: `${headerBox.height}px`,
                                    pointerEvents: panZoom.isActive ? "none" : undefined,
                                }}
                            >
                                {renderLayerHeader(layer, { isCurrent: isFamilyFramed && currentLayer === layer })}
                            </div>

                            <ul className={styles.bracketList} aria-labelledby={headerId}>
                                {layout.placements
                                    .filter((placement) => placement.layer === layer)
                                    .map((placement) => renderItem(placement.id))}
                            </ul>
                        </Fragment>
                    );
                })
            ) : (
                <ul className={styles.bracketList} aria-label={props.ariaLabel}>
                    {layout.placements.map((placement) => renderItem(placement.id))}
                </ul>
            )}
        </div>
    );

    if (!panZoom.isActive) return board;

    return (
        <div
            ref={windowRef}
            className={styles.bracketWindow}
            style={{
                touchAction: isPannable || isZoomable ? "none" : undefined,
                userSelect: isPannable ? "none" : undefined,
            }}
            onPointerDown={(e) => panZoom.gestures.press(e.nativeEvent)}
            onPointerMove={(e) => panZoom.gestures.move(e.nativeEvent, e.currentTarget)}
            onPointerUp={(e) => panZoom.gestures.release(e.nativeEvent, e.currentTarget)}
            onPointerCancel={(e) => panZoom.gestures.release(e.nativeEvent, e.currentTarget)}
            onScroll={(e) => {
                e.currentTarget.scrollLeft = BracketConst.NOTHING;
                e.currentTarget.scrollTop = BracketConst.NOTHING;
            }}
        >
            {board}
        </div>
    );
};
