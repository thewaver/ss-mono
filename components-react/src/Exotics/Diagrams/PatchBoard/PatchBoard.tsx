import { Fragment, type ReactNode, useEffect, useId, useRef, useState } from "react";

import {
    CarrierUtils,
    type CarrierZone,
    LiveAnnouncerUtils,
    PATCH_BOARD_DEFAULTS,
    type PatchBoardCarry,
    type PatchBoardHandle,
    type PatchBoardNode,
    type PatchBoardNodeFlags,
    type PatchBoardPlace,
    type PatchBoardPlacedSocket,
    type PatchBoardSocketFlags,
    PatchBoardStyles,
    PatchBoardUtils,
    PlacementUtils,
} from "@thewaver/ss-components";

import { CarrierReactUtils } from "../../../Abstracts/Carrier/CarrierReact.utils";
import { LabelReactUtils } from "../../../Essentials/Input/Label/LabelReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useElement, useLatest } from "../../../Utils/refUtils";
import type { PatchBoardProps } from "./PatchBoard.types";

const NOTHING = 0;
const FULL_WIDTH = 1;

export const PatchBoard = <T,>(props: PatchBoardProps<T>) => {
    const [nodes] = props.nodes;
    const [links] = props.links;

    const boardId = useId();
    const nodeHintId = useId();
    const socketHintId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const stopRefs = useRef(new Map<string, HTMLElement>());

    const rootElement = useElement(rootRef);

    const [focusedStop, setFocusedStop] = useState<string>();

    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.isDisabled ?? false;
    const isLocked = props.isLocked ?? false;
    const orientation = props.orientation ?? PATCH_BOARD_DEFAULTS.orientation;
    const socketSize = props.socketSize ?? PATCH_BOARD_DEFAULTS.socketSize;

    const carryState = CarrierReactUtils.useCarry();
    const isTargetAllowed = CarrierReactUtils.useIsTargetAllowed();

    const focusStop = (stopKey: string | undefined) => {
        if (stopKey === undefined) return;

        setFocusedStop(stopKey);
        stopRefs.current.get(stopKey)?.focus();
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

    const latest = useLatest({ props, placements, placedByEndKey, focusStop });

    const stopKeys = PatchBoardUtils.getStopKeys(placements);
    const rovingStop = focusedStop !== undefined && stopKeys.includes(focusedStop) ? focusedStop : stopKeys[NOTHING];

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

        stopRefs.current.get(scrollKey)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [scrollKey, aimedPlace]);

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
                className={PatchBoardStyles.patchBoardSocketHolder}
                style={{
                    left: PlacementUtils.toContainerWidth(
                        (placed?.point.x ?? NOTHING) - (placement?.spot.x ?? NOTHING),
                    ),
                    top: PlacementUtils.toContainerWidth((placed?.point.y ?? NOTHING) - (placement?.spot.y ?? NOTHING)),
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
                            className={PatchBoardStyles.patchBoardSocket}
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
                            onFocus={() => setFocusedStop(stopKey)}
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
                className={PatchBoardStyles.patchBoardSlot}
                role="group"
                style={{
                    left: PlacementUtils.toContainerWidth(placement?.spot.x ?? node.spot.x),
                    top: PlacementUtils.toContainerWidth(placement?.spot.y ?? node.spot.y),
                    width: PlacementUtils.toContainerWidth(node.sizeShare.width),
                    height: PlacementUtils.toContainerWidth(node.sizeShare.height),
                }}
            >
                <div className={PatchBoardStyles.patchBoardNodeHolder}>
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
                                className={PatchBoardStyles.patchBoardNode}
                                role="button"
                                aria-label={props.computeNodeLabel(node.value)}
                                aria-disabled={(node.isDisabled ?? false) || undefined}
                                aria-describedby={nodeHintId}
                                onPointerDown={(e) => board.handleNodePointerDown(node, e.nativeEvent, e.currentTarget)}
                                onClick={(e) => board.handleNodeClick(node, e.nativeEvent, e.currentTarget)}
                                onKeyDown={(e) => board.handleStopKeyDown(nodeKey, node, undefined, e.nativeEvent)}
                                onFocus={() => setFocusedStop(nodeKey)}
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

    return (
        <div
            id={boardId}
            ref={rootRef}
            className={PatchBoardStyles.patchBoardRoot}
            role="group"
            aria-label={ariaLabel}
            aria-disabled={isDisabled || undefined}
            onClick={(e) => board.handleRootClick(e.nativeEvent)}
        >
            <div
                className={PatchBoardStyles.patchBoardSpacer}
                style={{ height: PlacementUtils.toContainerWidth(props.heightRatio) }}
                aria-hidden="true"
            />
            <div id={nodeHintId} className={PatchBoardStyles.patchBoardHint}>
                {props.announcements.nodeRestingKeyHint}
            </div>
            <div id={socketHintId} className={PatchBoardStyles.patchBoardHint}>
                {props.announcements.socketRestingKeyHint}
            </div>
            <svg
                className={PatchBoardStyles.patchBoardCables}
                viewBox={`0 0 ${FULL_WIDTH} ${props.heightRatio}`}
                aria-hidden="true"
            >
                {cableDefs.map((defs) => (
                    <Fragment key={defs.key}>{props.renderCable(defs)}</Fragment>
                ))}
            </svg>

            {nodes.map(renderNode)}
        </div>
    );
};
