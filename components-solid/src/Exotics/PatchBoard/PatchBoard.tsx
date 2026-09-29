import { Index, batch, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";

import {
    LiveAnnouncerUtils,
    PATCH_BOARD_DEFAULTS,
    type PatchBoardCarry,
    type PatchBoardHandle,
    type PatchBoardNode,
    type PatchBoardPlace,
    PatchBoardUtils,
    PlacementUtils,
    PatchBoardStyles as styles,
} from "@thewaver/ss-components";

import { CarrierSolidUtils } from "../../Abstracts/Carrier/CarrierSolid.utils";
import { LabelSolidUtils } from "../../Essentials/Input/Label/LabelSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../Utils/propUtils";
import type { PatchBoardProps } from "./PatchBoardSolid.types";

const NOTHING = 0;
const FULL_WIDTH = 1;

export const PatchBoard = <T,>(props: PatchBoardProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const nodesSignal = accessSignal(() => props.nodes);
    const linksSignal = accessSignal(() => props.links);

    const boardId = createUniqueId();
    const nodeHintId = createUniqueId();
    const socketHintId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedStop, setFocusedStop] = createSignal<string>();

    const stopRefs = new Map<string, HTMLElement>();

    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getNodes = createMemo(() => nodesSignal[0]());

    const getLinks = createMemo(() => linksSignal[0]());

    const getHeightRatio = createMemo(() => access(props.heightRatio));

    const getGroupId = createMemo(() => access(props.groupId));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getOrientation = createMemo(() => access(props.orientation) ?? PATCH_BOARD_DEFAULTS.orientation);

    const getSocketSize = createMemo(() => access(props.socketSize) ?? PATCH_BOARD_DEFAULTS.socketSize);

    const getSocketReach = createMemo(() => access(props.socketReach) ?? PATCH_BOARD_DEFAULTS.socketReach);

    const getStepSize = createMemo(() => access(props.stepSize) ?? PATCH_BOARD_DEFAULTS.stepSize);

    const getNodeKey = (node: PatchBoardNode<T>) => props.computeNodeKey(node.value);

    const getNodeLabel = (node: PatchBoardNode<T>) => props.computeNodeLabel(node.value);

    const focusStop = (stopKey: string | undefined) => {
        if (stopKey === undefined) return;

        setFocusedStop(stopKey);
        stopRefs.get(stopKey)?.focus();
    };

    const board: PatchBoardHandle<T> = PatchBoardUtils.createBoard<T>({
        getZone: () => board.zone,
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getIsDisabled,
        getIsLocked,
        getAnnouncements: () => access(props.announcements),
        getHeightRatio,
        getSocketReach,
        getStepSize,
        getSnapSpot: () => props.computeSnapSpot,
        getCanLink: () => props.computeCanLink,
        getNodes,
        getLinks,
        getPlacements: () => getPlacements(),
        getPlacedSocketByEndKey: () => getPlacedSocketByEndKey(),
        computeNodeKey: props.computeNodeKey,
        computeNodeLabel: props.computeNodeLabel,
        updateNodes: (update) => nodesSignal[1]((nodes) => update(nodes)),
        updateLinks: (update) => linksSignal[1]((links) => update(links)),
        focusStop,
        onLink: (link) => props.onLink?.(link),
        onUnlink: (link) => props.onUnlink?.(link),
        onMove: (nodeKey, spot) => props.onMove?.(nodeKey, spot),
        batch,
    });

    CarrierSolidUtils.registerZone(board.zone);

    const getCarry = () =>
        CarrierSolidUtils.getSourceZone() === board.zone ? CarrierSolidUtils.getCarry() : undefined;

    const getCarriedNodeKey = createMemo(() => {
        const carry = getCarry();

        return carry && (carry.value as PatchBoardCarry<T>).kind === "node" ? carry.key : undefined;
    });

    const getPlugSource = createMemo(() => {
        const carry = getCarry();
        const value = carry && (carry.value as PatchBoardCarry<T>);

        return value?.kind === "plug" ? value.from : undefined;
    });

    const getAimedPlace = createMemo(() => {
        const place = CarrierSolidUtils.getTargetPlace();

        if (!getCarry() || place === undefined) return undefined;

        return place as PatchBoardPlace;
    });

    const getPlacements = createMemo(() =>
        PatchBoardUtils.getPlacements(getNodes(), props.computeNodeKey, getCarriedNodeKey(), getAimedPlace()),
    );

    const getPlacedSocketByEndKey = createMemo(() =>
        PatchBoardUtils.getPlacedSocketByEndKey(PatchBoardUtils.getPlacedSockets(getPlacements(), getOrientation())),
    );

    const getPlacementByKey = createMemo(() => new Map(getPlacements().map((placement) => [placement.key, placement])));

    const getStopKeys = createMemo(() => PatchBoardUtils.getStopKeys(getPlacements()));

    const getRovingStop = createMemo(() => {
        const keys = getStopKeys();
        const focused = getFocusedStop();

        return focused !== undefined && keys.includes(focused) ? focused : keys[NOTHING];
    });

    const getCableDefs = createMemo(() => {
        const source = getPlugSource();
        const place = getAimedPlace();

        return PatchBoardUtils.getCableDefs(
            getLinks(),
            getPlacedSocketByEndKey(),
            getOrientation(),
            source && place
                ? {
                      key: `${boardId}-pending`,
                      from: source,
                      place,
                      isAllowed: CarrierSolidUtils.getIsTargetAllowed(),
                  }
                : undefined,
        );
    });

    const setStopRef = (stopKey: string, element: HTMLElement) => {
        stopRefs.set(stopKey, element);

        onCleanup(() => {
            if (stopRefs.get(stopKey) === element) stopRefs.delete(stopKey);
        });
    };

    createEffect(() => {
        if (!getCarry()) return;

        onCleanup(board.observeTapAim());
    });

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        onCleanup(board.observeClicks(root));
    });

    createEffect(() => {
        const place = getAimedPlace();

        if (!place || place.kind === "free" || CarrierSolidUtils.getCarryMode() !== "key") return;

        const stopKey = place.kind === "spot" ? getCarriedNodeKey() : PatchBoardUtils.getEndKey(place);

        if (stopKey === undefined) return;

        stopRefs.get(stopKey)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });

    createEffect(() => {
        if (!getIsDisabled() || !getCarry()) return;

        CarrierSolidUtils.end("cancel");
    });

    onCleanup(() => {
        board.cancel();
    });

    return (
        <div
            id={boardId}
            ref={setRootRef}
            class={styles.patchBoardRoot}
            role="group"
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            onClick={(e) => board.handleRootClick(e)}
        >
            <div
                class={styles.patchBoardSpacer}
                style={{ height: PlacementUtils.toContainerWidth(getHeightRatio()) }}
                aria-hidden="true"
            />
            <div id={nodeHintId} class={styles.patchBoardHint}>
                {access(props.announcements).nodeRestingKeyHint}
            </div>
            <div id={socketHintId} class={styles.patchBoardHint}>
                {access(props.announcements).socketRestingKeyHint}
            </div>
            <svg class={styles.patchBoardCables} viewBox={`0 0 ${FULL_WIDTH} ${getHeightRatio()}`} aria-hidden="true">
                <Index each={getCableDefs()}>{(getDefs) => <>{props.renderCable(getDefs)}</>}</Index>
            </svg>

            <Index each={getNodes()}>
                {(getNode) => {
                    const getKey = createMemo(() => getNodeKey(getNode()));

                    const getPlacement = createMemo(() => getPlacementByKey().get(getKey()));

                    return (
                        <div
                            class={styles.patchBoardSlot}
                            role="group"
                            style={{
                                left: PlacementUtils.toContainerWidth(getPlacement()?.spot.x ?? getNode().spot.x),
                                top: PlacementUtils.toContainerWidth(getPlacement()?.spot.y ?? getNode().spot.y),
                                width: PlacementUtils.toContainerWidth(getNode().sizeShare.width),
                                height: PlacementUtils.toContainerWidth(getNode().sizeShare.height),
                            }}
                        >
                            <div class={styles.patchBoardNodeHolder}>
                                <InteractionWrapper
                                    sizing={() => "fill"}
                                    isDisabled={() => getNode().isDisabled ?? false}
                                    isFocusableWhenDisabled={() => !getIsDisabled()}
                                    isTabbable={() => getRovingStop() === getKey()}
                                    extraFlags={() => ({ isCarried: getCarriedNodeKey() === getKey() })}
                                    renderControl={(setElementRef, getFlags) => (
                                        <div
                                            ref={(element) => {
                                                setStopRef(getKey(), element);
                                                setElementRef(element);
                                            }}
                                            class={styles.patchBoardNode}
                                            role="button"
                                            aria-label={getNodeLabel(getNode())}
                                            aria-disabled={(getNode().isDisabled ?? false) || undefined}
                                            aria-describedby={nodeHintId}
                                            onPointerDown={(e) =>
                                                board.handleNodePointerDown(getNode(), e, e.currentTarget)
                                            }
                                            onClick={(e) => board.handleNodeClick(getNode(), e, e.currentTarget)}
                                            onKeyDown={(e) =>
                                                board.handleStopKeyDown(getKey(), getNode(), undefined, e)
                                            }
                                            onFocus={() => setFocusedStop(getKey())}
                                        >
                                            {props.renderNode(getNode, getFlags)}
                                        </div>
                                    )}
                                />
                            </div>

                            <Index each={getNode().sockets}>
                                {(getSocket) => {
                                    const getEnd = createMemo(() => ({
                                        nodeKey: getKey(),
                                        socketId: getSocket().id,
                                    }));

                                    const getStopKey = createMemo(() => PatchBoardUtils.getEndKey(getEnd()));

                                    const getPlaced = createMemo(() => getPlacedSocketByEndKey().get(getStopKey()));

                                    const getOffset = createMemo(() => ({
                                        x: (getPlaced()?.point.x ?? NOTHING) - (getPlacement()?.spot.x ?? NOTHING),
                                        y: (getPlaced()?.point.y ?? NOTHING) - (getPlacement()?.spot.y ?? NOTHING),
                                    }));

                                    const getSocketFlags = createMemo(() =>
                                        PatchBoardUtils.getSocketFlags(getEnd(), getSocket().kind, {
                                            placed: getPlaced(),
                                            links: getLinks(),
                                            aimedPlace: getAimedPlace(),
                                            plugSource: getPlugSource(),
                                            getIsEndAllowed: board.getIsEndAllowed,
                                        }),
                                    );

                                    return (
                                        <div
                                            class={styles.patchBoardSocketHolder}
                                            style={{
                                                left: PlacementUtils.toContainerWidth(getOffset().x),
                                                top: PlacementUtils.toContainerWidth(getOffset().y),
                                                width: PlacementUtils.toContainerWidth(getSocketSize()),
                                                height: PlacementUtils.toContainerWidth(getSocketSize()),
                                            }}
                                        >
                                            <InteractionWrapper
                                                sizing={() => "fill"}
                                                isDisabled={() =>
                                                    (getNode().isDisabled ?? false) || (getSocket().isDisabled ?? false)
                                                }
                                                isFocusableWhenDisabled={() => !getIsDisabled()}
                                                isTabbable={() => getRovingStop() === getStopKey()}
                                                extraFlags={getSocketFlags}
                                                renderControl={(setElementRef, getFlags) => (
                                                    <div
                                                        ref={(element) => {
                                                            setStopRef(getStopKey(), element);
                                                            setElementRef(element);
                                                        }}
                                                        class={styles.patchBoardSocket}
                                                        role="button"
                                                        aria-label={access(props.announcements).computeSocketLabel(
                                                            board.getEndLabel(getEnd()),
                                                            getSocket().kind,
                                                            getSocketFlags().isTaken,
                                                        )}
                                                        aria-disabled={
                                                            getPlaced()?.isDisabled || getIsLocked() || undefined
                                                        }
                                                        aria-describedby={socketHintId}
                                                        onPointerDown={(e) =>
                                                            board.handleSocketPointerDown(getPlaced(), e)
                                                        }
                                                        onClick={(e) => board.handleSocketClick(getPlaced(), e)}
                                                        onKeyDown={(e) =>
                                                            board.handleStopKeyDown(
                                                                getStopKey(),
                                                                getNode(),
                                                                getPlaced(),
                                                                e,
                                                            )
                                                        }
                                                        onFocus={() => setFocusedStop(getStopKey())}
                                                    >
                                                        {props.renderSocket?.(getSocket, getFlags)}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    );
                                }}
                            </Index>
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};
