import { Fragment, type ReactNode, useEffect, useId, useRef, useState } from "react";

import {
    CarrierUtils,
    type CarrierZone,
    LiveAnnouncerUtils,
    PATCH_BOARD_DEFAULTS,
    PanZoomUtils,
    type PatchBoardCarry,
    type PatchBoardHandle,
    type PatchBoardNode,
    type PatchBoardNodeFlags,
    type PatchBoardPlace,
    type PatchBoardPlacedSocket,
    type PatchBoardSocketFlags,
    PatchBoardUtils,
    PlacementUtils,
    PatchBoardStyles as styles,
} from "@thewaver/ss-components";
import { PatchBoardConst } from "@thewaver/ss-components/internal";

import { CarrierReactUtils } from "../../../Abstracts/Carrier/CarrierReact.utils";
import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { PanZoomReactUtils } from "../../../Abstracts/PanZoom/PanZoomReact.utils";
import { LabelReactUtils } from "../../../Essentials/Input/Label/LabelReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useElement, useLatest } from "../../../Utils/refUtils";
import type { PatchBoardProps } from "./PatchBoard.types";

export const PatchBoard = <T,>(props: PatchBoardProps<T>) => {
    const [nodes] = props.nodes;
    const [links] = props.links;

    const boardId = useId();
    const nodeHintId = useId();
    const socketHintId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const stopRefs = useRef(new Map<string, HTMLElement>());

    const windowRef = useRef<HTMLDivElement | null>(null);

    const rootElement = useElement(rootRef);
    const windowElement = useElement(windowRef);

    const [focusedStop, setFocusedStop] = useState<string>();

    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.isDisabled ?? false;
    const isLocked = props.isLocked ?? false;
    const orientation = props.orientation ?? PATCH_BOARD_DEFAULTS.orientation;
    const socketSize = props.socketSize ?? PATCH_BOARD_DEFAULTS.socketSize;
    const isPannable = props.isPannable ?? PATCH_BOARD_DEFAULTS.isPannable;
    const isZoomable = props.isZoomable ?? PATCH_BOARD_DEFAULTS.isZoomable;

    const windowSize = ElementObserverReactUtils.useBorderBoxSize(windowRef);

    const panZoom = PanZoomReactUtils.usePanZoom({
        source: props.view,
        windowRef,
        size: windowSize,
        range: PanZoomUtils.toFullView(PatchBoardConst.FULL_WIDTH, props.heightRatio),
        minWidth: PatchBoardConst.FULL_WIDTH / (props.maxScale ?? PATCH_BOARD_DEFAULTS.maxScale),
        durationMs: props.transitionDurationMs ?? PATCH_BOARD_DEFAULTS.transitionDurationMs,
        isPannable,
        isZoomable,
    });

    useEffect(() => {
        props.onMount?.(panZoom.controller);
    }, [panZoom.controller]);

    const layoutWidth = props.boardWidth ?? windowSize.width;

    const boardTransform = (() => {
        if (!panZoom.isActive) return undefined;

        const scale = PanZoomUtils.computeScale(panZoom.shownView, windowSize.width) / layoutWidth;

        return `scale(${scale}) translate(${-panZoom.shownView.x.start * layoutWidth}px, ${-panZoom.shownView.y.start * layoutWidth}px)`;
    })();

    const revealStop = (stopKey: string) => {
        const root = rootRef.current;
        const element = stopRefs.current.get(stopKey);

        if (!panZoom.isActive || !root || !element) return;

        const boardRect = root.getBoundingClientRect();
        const stopRect = element.getBoundingClientRect();

        if (boardRect.width === PatchBoardConst.NOTHING) return;

        panZoom.controller.showArea({
            x: {
                start: (stopRect.left - boardRect.left) / boardRect.width,
                end: (stopRect.right - boardRect.left) / boardRect.width,
            },
            y: {
                start: (stopRect.top - boardRect.top) / boardRect.width,
                end: (stopRect.bottom - boardRect.top) / boardRect.width,
            },
        });
    };

    const getIsOnStop = (target: EventTarget | null) =>
        [...stopRefs.current.values()].some((element) => target instanceof Node && element.contains(target));

    const carryState = CarrierReactUtils.useCarry();
    const isTargetAllowed = CarrierReactUtils.useIsTargetAllowed();

    const focusStop = (stopKey: string | undefined) => {
        if (stopKey === undefined) return;

        setFocusedStop(stopKey);
        stopRefs.current.get(stopKey)?.focus({ preventScroll: latest.current.isWindowed });
    };

    const [board] = useState<PatchBoardHandle<T>>(() =>
        PatchBoardUtils.createBoard<T>({
            getZone: () => zone,
            getGroupId: () => latest.current.props.groupId,
            getLabel: () => latest.current.props.ariaLabel,
            getRootRef: () => rootRef.current ?? undefined,
            getIsDisabled: () => latest.current.props.isDisabled ?? false,
            getIsLocked: () => latest.current.props.isLocked ?? false,
            getAnnouncements: () => latest.current.props.announcements,
            getHeightRatio: () => latest.current.props.heightRatio,
            getSocketReach: () => latest.current.props.socketReach ?? PATCH_BOARD_DEFAULTS.socketReach,
            getStepSize: () => latest.current.props.stepSize ?? PATCH_BOARD_DEFAULTS.stepSize,
            getSnapSpot: () => latest.current.props.computeSnapSpot,
            getCanLink: () => latest.current.props.computeCanLink,
            getNodes: () => latest.current.props.nodes[0],
            getLinks: () => latest.current.props.links[0],
            getPlacements: () => latest.current.placements,
            getPlacedSocketByEndKey: () => latest.current.placedByEndKey,
            computeNodeKey: (value) => latest.current.props.computeNodeKey(value),
            computeNodeLabel: (value) => latest.current.props.computeNodeLabel(value),
            updateNodes: (update) => latest.current.props.nodes[1](update(latest.current.props.nodes[0])),
            updateLinks: (update) => latest.current.props.links[1](update(latest.current.props.links[0])),
            focusStop: (stopKey) => latest.current.focusStop(stopKey),
            onLink: (link) => latest.current.props.onLink?.(link),
            onUnlink: (link) => latest.current.props.onUnlink?.(link),
            onMove: (nodeKey, spot) => latest.current.props.onMove?.(nodeKey, spot),
        }),
    );

    const zone: CarrierZone = CarrierReactUtils.useZone(board.zone);

    const isSource = carryState !== undefined && carryState.from === zone;
    const carriedValue = isSource ? (carryState.carry.value as PatchBoardCarry<T>) : undefined;
    const carriedNodeKey = carriedValue?.kind === "node" ? carryState?.carry.key : undefined;
    const plugSource = carriedValue?.kind === "plug" ? carriedValue.from : undefined;
    const aimedPlace = isSource ? (carryState.toPlace as PatchBoardPlace) : undefined;

    const placements = PatchBoardUtils.getPlacements(nodes, props.computeNodeKey, carriedNodeKey, aimedPlace);
    const placementByKey = new Map(placements.map((placement) => [placement.key, placement]));
    const placedByEndKey = PatchBoardUtils.getPlacedSocketByEndKey(
        PatchBoardUtils.getPlacedSockets(placements, orientation),
    );

    const latest = useLatest({ props, placements, placedByEndKey, focusStop, isWindowed: panZoom.isActive });

    const stopKeys = PatchBoardUtils.getStopKeys(placements);
    const rovingStop =
        focusedStop !== undefined && stopKeys.includes(focusedStop) ? focusedStop : stopKeys[PatchBoardConst.NOTHING];

    const cableDefs = PatchBoardUtils.getCableDefs(
        links,
        placedByEndKey,
        orientation,
        plugSource && aimedPlace
            ? { key: `${boardId}-pending`, from: plugSource, place: aimedPlace, isAllowed: isTargetAllowed }
            : undefined,
    );

    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    useEffect(() => (isSource ? board.observeTapAim() : undefined), [board, isSource]);

    useEffect(() => (rootElement ? board.observeClicks(rootElement) : undefined), [board, rootElement]);

    const scrollKey =
        !aimedPlace || aimedPlace.kind === "free" || carryState?.mode !== "key"
            ? undefined
            : aimedPlace.kind === "spot"
              ? carriedNodeKey
              : PatchBoardUtils.getEndKey(aimedPlace);

    useEffect(() => {
        if (scrollKey === undefined) return;

        if (panZoom.isActive) {
            revealStop(scrollKey);

            return;
        }

        stopRefs.current.get(scrollKey)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [scrollKey, aimedPlace]);

    useEffect(() => {
        if (!windowElement) return;

        const handleWheel = (e: WheelEvent) => panZoom.gestures.wheel(e);

        windowElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => windowElement.removeEventListener("wheel", handleWheel);
    }, [windowElement, panZoom.gestures]);

    useEffect(() => {
        if (!isDisabled || !isSource) return;

        CarrierUtils.end("cancel");
    }, [isDisabled, isSource]);

    useEffect(() => () => board.cancel(), [board]);

    const setStopRef = (stopKey: string, element: HTMLElement | null) => {
        if (element) {
            stopRefs.current.set(stopKey, element);

            return;
        }

        stopRefs.current.delete(stopKey);
    };

    const renderSocket = (node: PatchBoardNode<T>, nodeKey: string, socket: PatchBoardNode<T>["sockets"][number]) => {
        const end = { nodeKey, socketId: socket.id };
        const stopKey = PatchBoardUtils.getEndKey(end);
        const placed: PatchBoardPlacedSocket | undefined = placedByEndKey.get(stopKey);
        const placement = placementByKey.get(nodeKey);
        const socketFlags = PatchBoardUtils.getSocketFlags(end, socket.kind, {
            placed,
            links,
            aimedPlace,
            plugSource,
            getIsEndAllowed: board.getIsEndAllowed,
        });

        return (
            <div
                key={socket.id}
                className={styles.patchBoardSocketHolder}
                style={{
                    left: PlacementUtils.toContainerWidth(
                        (placed?.point.x ?? PatchBoardConst.NOTHING) - (placement?.spot.x ?? PatchBoardConst.NOTHING),
                    ),
                    top: PlacementUtils.toContainerWidth(
                        (placed?.point.y ?? PatchBoardConst.NOTHING) - (placement?.spot.y ?? PatchBoardConst.NOTHING),
                    ),
                    width: PlacementUtils.toContainerWidth(socketSize),
                    height: PlacementUtils.toContainerWidth(socketSize),
                }}
            >
                <InteractionWrapper<PatchBoardSocketFlags>
                    sizing={"fill"}
                    isDisabled={(node.isDisabled ?? false) || (socket.isDisabled ?? false)}
                    isFocusableWhenDisabled={!isDisabled}
                    isTabbable={rovingStop === stopKey}
                    extraFlags={socketFlags}
                    renderControl={(setElementRef, flags) => (
                        <div
                            ref={(element) => {
                                setStopRef(stopKey, element);
                                setElementRef(element);
                            }}
                            className={styles.patchBoardSocket}
                            role="button"
                            aria-label={props.announcements.computeSocketLabel(
                                board.getEndLabel(end),
                                socket.kind,
                                socketFlags.isTaken,
                            )}
                            aria-disabled={placed?.isDisabled || isLocked || undefined}
                            aria-describedby={socketHintId}
                            onPointerDown={(e) => board.handleSocketPointerDown(placed, e.nativeEvent)}
                            onClick={(e) => board.handleSocketClick(placed, e.nativeEvent)}
                            onKeyDown={(e) => board.handleStopKeyDown(stopKey, node, placed, e.nativeEvent)}
                            onFocus={() => {
                                setFocusedStop(stopKey);
                                revealStop(stopKey);
                            }}
                        >
                            {props.renderSocket?.(socket, flags)}
                        </div>
                    )}
                />
            </div>
        );
    };

    const renderNode = (node: PatchBoardNode<T>): ReactNode => {
        const nodeKey = props.computeNodeKey(node.value);
        const placement = placementByKey.get(nodeKey);

        return (
            <div
                key={nodeKey}
                className={styles.patchBoardSlot}
                role="group"
                style={{
                    left: PlacementUtils.toContainerWidth(placement?.spot.x ?? node.spot.x),
                    top: PlacementUtils.toContainerWidth(placement?.spot.y ?? node.spot.y),
                    width: PlacementUtils.toContainerWidth(node.sizeShare.width),
                    height: PlacementUtils.toContainerWidth(node.sizeShare.height),
                }}
            >
                <div className={styles.patchBoardNodeHolder}>
                    <InteractionWrapper<PatchBoardNodeFlags>
                        sizing={"fill"}
                        isDisabled={node.isDisabled ?? false}
                        isFocusableWhenDisabled={!isDisabled}
                        isTabbable={rovingStop === nodeKey}
                        extraFlags={{ isCarried: carriedNodeKey === nodeKey }}
                        renderControl={(setElementRef, flags) => (
                            <div
                                ref={(element) => {
                                    setStopRef(nodeKey, element);
                                    setElementRef(element);
                                }}
                                className={styles.patchBoardNode}
                                role="button"
                                aria-label={props.computeNodeLabel(node.value)}
                                aria-disabled={(node.isDisabled ?? false) || undefined}
                                aria-describedby={nodeHintId}
                                onPointerDown={(e) => board.handleNodePointerDown(node, e.nativeEvent, e.currentTarget)}
                                onClick={(e) => board.handleNodeClick(node, e.nativeEvent, e.currentTarget)}
                                onKeyDown={(e) => board.handleStopKeyDown(nodeKey, node, undefined, e.nativeEvent)}
                                onFocus={() => {
                                    setFocusedStop(nodeKey);
                                    revealStop(nodeKey);
                                }}
                            >
                                {props.renderNode(node, flags)}
                            </div>
                        )}
                    />
                </div>

                {node.sockets.map((socket) => renderSocket(node, nodeKey, socket))}
            </div>
        );
    };

    const boardElement = (
        <div
            id={boardId}
            ref={rootRef}
            className={styles.patchBoardRoot}
            style={{
                width: panZoom.isActive && props.boardWidth !== undefined ? `${layoutWidth}px` : undefined,
                transform: boardTransform,
            }}
            role="group"
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
            onClick={(e) => board.handleRootClick(e.nativeEvent)}
        >
            <div
                className={styles.patchBoardSpacer}
                style={{ height: PlacementUtils.toContainerWidth(props.heightRatio) }}
                aria-hidden="true"
            />
            <div id={nodeHintId} className={styles.patchBoardHint}>
                {props.announcements.nodeRestingKeyHint}
            </div>
            <div id={socketHintId} className={styles.patchBoardHint}>
                {props.announcements.socketRestingKeyHint}
            </div>
            <svg
                className={styles.patchBoardCables}
                viewBox={`0 0 ${PatchBoardConst.FULL_WIDTH} ${props.heightRatio}`}
                aria-hidden="true"
            >
                {cableDefs.map((defs) => (
                    <Fragment key={defs.key}>{props.renderCable(defs)}</Fragment>
                ))}
            </svg>

            {nodes.map(renderNode)}
        </div>
    );

    if (!panZoom.isActive) return boardElement;

    return (
        <div
            ref={windowRef}
            className={styles.patchBoardWindow}
            style={{
                aspectRatio: `${PatchBoardConst.FULL_WIDTH} / ${props.heightRatio}`,
                touchAction: isPannable || isZoomable ? "none" : undefined,
                userSelect: isPannable ? "none" : undefined,
            }}
            onPointerDown={(e) => {
                if (getIsOnStop(e.target)) return;

                panZoom.gestures.press(e.nativeEvent);
            }}
            onPointerMove={(e) => panZoom.gestures.move(e.nativeEvent, e.currentTarget)}
            onPointerUp={(e) => panZoom.gestures.release(e.nativeEvent, e.currentTarget)}
            onPointerCancel={(e) => panZoom.gestures.release(e.nativeEvent, e.currentTarget)}
            onScroll={(e) => {
                e.currentTarget.scrollLeft = PatchBoardConst.NOTHING;
                e.currentTarget.scrollTop = PatchBoardConst.NOTHING;
            }}
        >
            {boardElement}
        </div>
    );
};
