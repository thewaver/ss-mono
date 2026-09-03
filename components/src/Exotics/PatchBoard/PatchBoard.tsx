import { Index, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryMode, CarryNudge, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierStack } from "../../Abstracts/Carrier/CarrierStack";
import { LiveAnnouncer } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer";
import { LabelUtils } from "../../Fundamentals/Input/Label/Label.utils";
import { InteractionWrapper } from "../../Fundamentals/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../Utils/propUtils";
import { useViewportContext } from "../Viewport/Viewport.context";
import type {
    PatchBoardCableDefs,
    PatchBoardCarry,
    PatchBoardEnd,
    PatchBoardNode,
    PatchBoardOrientation,
    PatchBoardPlace,
    PatchBoardPlacedSocket,
    PatchBoardPlacement,
    PatchBoardProps,
} from "./PatchBoard.types";
import { PatchBoardUtils } from "./PatchBoard.utils";

import * as styles from "./PatchBoard.css";

const DEFAULT_ORIENTATION: PatchBoardOrientation = "horizontal";
const DEFAULT_SOCKET_SIZE = 14;
const DEFAULT_SOCKET_REACH = 28;
const DEFAULT_STEP_SIZE = 8;
const COARSE_STEP_FACTOR = 4;
const NOTHING = 0;
const SINGLE = 1;

const INTERACTIVE_SELECTOR =
    "a[href], button, input, select, textarea, [role='button'], [role='checkbox'], [role='link'], [role='switch']";

const NUDGE_KEYS: Record<string, CarryNudge | undefined> = {
    ArrowRight: { x: 1 },
    ArrowLeft: { x: -1 },
    ArrowDown: { y: 1 },
    ArrowUp: { y: -1 },
};

export const PatchBoard = <T,>(props: PatchBoardProps<T>) => {
    const nodesSignal = accessSignal(() => props.nodesSignal);
    const linksSignal = accessSignal(() => props.linksSignal);

    const boardId = createUniqueId();

    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedStop, setFocusedStop] = createSignal<string>();

    const stopRefs = new Map<string, HTMLElement>();

    let grabOffset: Point2d = { x: NOTHING, y: NOTHING };
    let hasPendingClick = false;

    const getAriaLabel = LabelUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getNodes = createMemo(() => nodesSignal[0]());

    const getLinks = createMemo(() => linksSignal[0]());

    const getSize = createMemo(() => access(props.size));

    const getGroupId = createMemo(() => access(props.groupId));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getOrientation = createMemo(() => access(props.orientation) ?? DEFAULT_ORIENTATION);

    const getSocketSize = createMemo(() => access(props.socketSize) ?? DEFAULT_SOCKET_SIZE);

    const getSocketReach = createMemo(() => access(props.socketReach) ?? DEFAULT_SOCKET_REACH);

    const getStepSize = createMemo(() => access(props.stepSize) ?? DEFAULT_STEP_SIZE);

    const getNodeKey = (node: PatchBoardNode<T>) => props.computeNodeKey(node.value);

    const getNodeLabel = (node: PatchBoardNode<T>) => props.computeNodeLabel(node.value);

    const asCarry = (carry: Carry) => carry.value as PatchBoardCarry<T>;

    const asPlace = (place: CarryPlace) => place as PatchBoardPlace;

    const findNode = (nodeKey: string) => getNodes().find((node) => getNodeKey(node) === nodeKey);

    const getEndLabel = (end: PatchBoardEnd) => {
        const node = findNode(end.nodeKey);
        const socket = node?.sockets.find((entry) => entry.id === end.socketId);

        return `${node ? getNodeLabel(node) : end.nodeKey} ${socket?.label ?? end.socketId}`;
    };

    const getIsEndAllowed = (fromEnd: PatchBoardEnd, toEnd: PatchBoardEnd) => {
        const placed = getPlacedSockets();
        const from = PatchBoardUtils.findSocket(placed, fromEnd);
        const to = PatchBoardUtils.findSocket(placed, toEnd);

        if (!from || !to) return false;
        if (getIsLocked()) return false;
        if (!PatchBoardUtils.getIsPairAllowed(from, to, getLinks())) return false;

        const link = PatchBoardUtils.getLink(from, to);

        return link !== undefined && (props.computeCanLink?.(link) ?? true);
    };

    const getBoardPoint = (point: Point2d) => {
        const root = getRootRef();

        if (!root) return undefined;

        const rect = root.getBoundingClientRect();
        const scale = viewportContext.getScale();

        return { x: (point.x - rect.left) / scale, y: (point.y - rect.top) / scale };
    };

    const zone: CarrierZone = {
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getIsDisabled,
        getKeyHint: () => {
            const carry = CarrierStack.getCarry();

            return carry && asCarry(carry).kind === "plug"
                ? "Arrow keys choose a socket, Enter connects, Escape cancels."
                : "Arrow keys move it, Enter drops, Escape cancels.";
        },
        computeCanAccept: (carry) => {
            if (getIsDisabled()) return false;

            const value = asCarry(carry);

            if (value.kind === "node") return true;

            return !getIsLocked() && PatchBoardUtils.findSocket(getPlacedSockets(), value.from) !== undefined;
        },
        computePlaceAtPoint: (point, carry) => {
            const board = getBoardPoint(point);

            if (!board) return undefined;

            const value = asCarry(carry);

            if (value.kind === "node") {
                return {
                    kind: "spot",
                    ...PatchBoardUtils.getClampedSpot(
                        { x: board.x - grabOffset.x, y: board.y - grabOffset.y },
                        value.node.size,
                        getSize(),
                    ),
                };
            }

            const socket = PatchBoardUtils.getNearestSocket(getCandidateSockets(), board, getSocketReach());

            return socket ? { kind: "socket", ...socket.end } : { kind: "free", ...board };
        },
        computeNudgedPlace: (place, nudge, carry) => {
            const current = asPlace(place);
            const value = asCarry(carry);

            if (value.kind === "node") {
                if (current.kind !== "spot") return undefined;

                const step = getStepSize();

                return {
                    kind: "spot",
                    ...PatchBoardUtils.getClampedSpot(
                        {
                            x: current.x + (nudge.x ?? NOTHING) * step,
                            y: current.y + (nudge.y ?? NOTHING) * step,
                        },
                        value.node.size,
                        getSize(),
                    ),
                };
            }

            const step = (nudge.x ?? NOTHING) + (nudge.y ?? NOTHING);

            if (step === NOTHING) return undefined;

            const socket = PatchBoardUtils.getSteppedSocket(
                getCandidateSockets(),
                current.kind === "socket" ? current : undefined,
                step,
            );

            return socket ? { kind: "socket", ...socket.end } : undefined;
        },
        computeEntryPlace: (carry) => {
            const value = asCarry(carry);

            return value.kind === "node" ? { kind: "spot", ...value.node.spot } : { kind: "socket", ...value.from };
        },
        computeIsSamePlace: (first, second) => {
            const one = asPlace(first);
            const other = asPlace(second);

            if (one.kind !== other.kind) return false;
            if (one.kind === "socket" && other.kind === "socket") return PatchBoardUtils.getIsSameEnd(one, other);
            if (one.kind === "socket" || other.kind === "socket") return false;

            return one.x === other.x && one.y === other.y;
        },
        computeIsPlaceAllowed: (place, carry) => {
            const current = asPlace(place);
            const value = asCarry(carry);

            if (value.kind === "node") return current.kind === "spot";
            if (current.kind !== "socket") return false;

            return getIsEndAllowed(value.from, current);
        },
        computePlaceLabel: (place, carry) => {
            const current = asPlace(place);
            const value = asCarry(carry);

            if (value.kind === "node") {
                return current.kind === "spot"
                    ? PatchBoardUtils.getRegionLabel(current, value.node.size, getSize())
                    : "off the board";
            }

            if (current.kind !== "socket") return "no socket";

            const isRefused =
                getCarry() !== undefined &&
                !PatchBoardUtils.getIsSameEnd(value.from, current) &&
                !getIsEndAllowed(value.from, current);

            return `${getEndLabel(current)}${isRefused ? ", cannot connect" : ""}`;
        },
        takeAt: (_unusedPlace, carry) => {
            const value = asCarry(carry);

            if (value.kind !== "node") return;

            const nodeKey = carry.key;
            const orphaned = getLinks().filter((link) => link.from.nodeKey === nodeKey || link.to.nodeKey === nodeKey);

            nodesSignal[1]((nodes) => nodes.filter((node) => getNodeKey(node) !== nodeKey));

            if (orphaned.length < SINGLE) return;

            linksSignal[1]((links) =>
                links.filter((link) => !orphaned.some((cut) => PatchBoardUtils.getIsSameLink(cut, link))),
            );

            orphaned.forEach((link) => props.onUnlink?.(link));
        },
        putAt: (place, carry) => {
            const current = asPlace(place);
            const value = asCarry(carry);

            if (value.kind !== "node" || current.kind !== "spot") return;

            const spot = { x: current.x, y: current.y };

            nodesSignal[1]((nodes) => [...nodes, { ...(value.node as PatchBoardNode<T>), spot }]);

            props.onMove?.(carry.key, spot);
        },
        moveAt: (_unusedFrom, toPlace, carry) => {
            const current = asPlace(toPlace);
            const value = asCarry(carry);

            if (value.kind === "node") {
                if (current.kind !== "spot") return;

                const spot = { x: current.x, y: current.y };

                nodesSignal[1]((nodes) =>
                    nodes.map((node) => (getNodeKey(node) === carry.key ? { ...node, spot } : node)),
                );

                props.onMove?.(carry.key, spot);

                return;
            }

            if (current.kind !== "socket") return;

            const placed = getPlacedSockets();
            const from = PatchBoardUtils.findSocket(placed, value.from);
            const to = PatchBoardUtils.findSocket(placed, current);
            const link = from && to && PatchBoardUtils.getLink(from, to);

            if (!link) return;

            linksSignal[1]((links) => [...links, link]);

            props.onLink?.(link);
        },
    };

    CarrierStack.registerZone(zone);

    const getCarry = () => (CarrierStack.getSourceZone() === zone ? CarrierStack.getCarry() : undefined);

    const getCarriedNodeKey = createMemo(() => {
        const carry = getCarry();

        return carry && asCarry(carry).kind === "node" ? carry.key : undefined;
    });

    const getPlugSource = createMemo(() => {
        const carry = getCarry();
        const value = carry && asCarry(carry);

        return value?.kind === "plug" ? value.from : undefined;
    });

    const getAimedPlace = createMemo(() => {
        const place = CarrierStack.getTargetPlace();

        if (!getCarry() || place === undefined) return undefined;

        return asPlace(place);
    });

    const getLiveSpot = (node: PatchBoardNode<T>) => {
        const place = getAimedPlace();

        if (getCarriedNodeKey() !== getNodeKey(node) || place?.kind !== "spot") return node.spot;

        return { x: place.x, y: place.y };
    };

    const getPlacements = createMemo((): PatchBoardPlacement[] =>
        getNodes().map((node) => ({
            key: getNodeKey(node),
            spot: getLiveSpot(node),
            size: node.size,
            sockets: node.sockets,
            isDisabled: node.isDisabled ?? false,
        })),
    );

    const getPlacedSockets = createMemo(() => PatchBoardUtils.getPlacedSockets(getPlacements(), getOrientation()));

    const getStopKeys = createMemo(() => PatchBoardUtils.getStopKeys(getPlacements()));

    const getNodeKeys = createMemo(() => PatchBoardUtils.getReadingOrder(getPlacements()).map((entry) => entry.key));

    const getRovingStop = createMemo(() => {
        const keys = getStopKeys();
        const focused = getFocusedStop();

        return focused !== undefined && keys.includes(focused) ? focused : keys[NOTHING];
    });

    const getCandidateSockets = createMemo(() => {
        const from = getPlugSource();

        if (!from) return [];

        return getPlacedSockets().filter((socket) => !PatchBoardUtils.getIsSameEnd(socket.end, from));
    });

    const getCableDefs = createMemo((): PatchBoardCableDefs[] => {
        const placed = getPlacedSockets();
        const defs = getLinks().reduce<PatchBoardCableDefs[]>((acc, link) => {
            const from = PatchBoardUtils.findSocket(placed, link.from);
            const to = PatchBoardUtils.findSocket(placed, link.to);

            if (from && to) {
                acc.push({
                    key: PatchBoardUtils.getLinkKey(link),
                    from: from.point,
                    to: to.point,
                    fromKind: from.kind,
                    orientation: getOrientation(),
                    isPending: false,
                    isAllowed: true,
                });
            }

            return acc;
        }, []);

        const source = getPlugSource();
        const place = getAimedPlace();
        const from = source && PatchBoardUtils.findSocket(placed, source);

        if (!from || !place || place.kind === "spot") return defs;

        const to =
            place.kind === "socket" ? PatchBoardUtils.findSocket(placed, place)?.point : { x: place.x, y: place.y };

        if (!to) return defs;

        return [
            ...defs,
            {
                key: `${boardId}-pending`,
                from: from.point,
                to,
                fromKind: from.kind,
                orientation: getOrientation(),
                isPending: true,
                isAllowed: CarrierStack.getIsTargetAllowed(),
            },
        ];
    });

    const setStopRef = (stopKey: string, element: HTMLElement) => {
        stopRefs.set(stopKey, element);

        onCleanup(() => {
            if (stopRefs.get(stopKey) === element) stopRefs.delete(stopKey);
        });
    };

    const focusStop = (stopKey: string | undefined) => {
        if (stopKey === undefined) return;

        setFocusedStop(stopKey);
        stopRefs.get(stopKey)?.focus();
    };

    const pickUpNode = (node: PatchBoardNode<T>, mode: CarryMode, from?: Point2d) => {
        if (getIsDisabled() || (node.isDisabled ?? false)) return;

        const board = from && getBoardPoint(from);

        grabOffset = board
            ? { x: board.x - node.spot.x, y: board.y - node.spot.y }
            : { x: node.size.width / 2, y: node.size.height / 2 };

        CarrierStack.start(
            zone,
            { kind: "spot", ...node.spot },
            {
                groupId: getGroupId(),
                key: getNodeKey(node),
                label: getNodeLabel(node),
                value: { kind: "node", node } satisfies PatchBoardCarry<T>,
            },
            mode,
        );
    };

    const pickUpPlug = (socket: PatchBoardPlacedSocket, mode: CarryMode) => {
        if (getIsDisabled() || getIsLocked() || socket.isDisabled) return;

        CarrierStack.start(
            zone,
            { kind: "socket", ...socket.end },
            {
                groupId: getGroupId(),
                key: PatchBoardUtils.getEndKey(socket.end),
                label: `cable from ${getEndLabel(socket.end)}`,
                value: { kind: "plug", from: socket.end } satisfies PatchBoardCarry<T>,
            },
            mode,
        );
    };

    const unplug = (end: PatchBoardEnd) => {
        if (getIsDisabled() || getIsLocked()) return false;

        const cut = PatchBoardUtils.getLinksAt(getLinks(), end);

        if (cut.length < SINGLE) return false;

        linksSignal[1]((links) =>
            links.filter((link) => !cut.some((removed) => PatchBoardUtils.getIsSameLink(removed, link))),
        );

        cut.forEach((link) => props.onUnlink?.(link));

        LiveAnnouncer.announce(
            `${cut.length > SINGLE ? `${cut.length} cables` : "Cable"} unplugged from ${getEndLabel(end)}.`,
        );

        return true;
    };

    const handleNodePointerDown = (node: PatchBoardNode<T>, e: PointerEvent) => {
        if (e.button !== NOTHING || getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
        if (CarrierStack.getCarry()) return;

        const root = getRootRef();

        if (!root) return;

        CarrierStack.dragFromPointer(
            root,
            e,
            (from) => pickUpNode(node, "drag", from),
            () => {
                hasPendingClick = true;
            },
        );
    };

    const handleSocketPointerDown = (socket: PatchBoardPlacedSocket | undefined, e: PointerEvent) => {
        if (e.button !== NOTHING || getIsDisabled() || getIsLocked() || !socket) return;
        if (CarrierStack.getCarry()) return;

        const root = getRootRef();

        if (!root) return;

        CarrierStack.dragFromPointer(
            root,
            e,
            () => pickUpPlug(socket, "drag"),
            () => {
                hasPendingClick = true;
            },
        );
    };

    const dropAtPointer = (e: MouseEvent) => {
        if (CarrierStack.getCarryMode() === "drag") return;
        if (CarrierStack.getCarryMode() === "key") CarrierStack.aimAtPoint(e.clientX, e.clientY);

        CarrierStack.end("drop");
    };

    const handleNodeClick = (node: PatchBoardNode<T>, e: MouseEvent) => {
        if (getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;

        if (!CarrierStack.getCarry()) {
            pickUpNode(node, "tap", { x: e.clientX, y: e.clientY });
            focusStop(getNodeKey(node));

            return;
        }

        dropAtPointer(e);
    };

    const handleSocketClick = (socket: PatchBoardPlacedSocket | undefined, e: MouseEvent) => {
        if (getIsDisabled() || !socket) return;

        if (CarrierStack.getCarry()) {
            dropAtPointer(e);

            return;
        }

        const stopKey = PatchBoardUtils.getEndKey(socket.end);

        focusStop(stopKey);

        if (PatchBoardUtils.getIsFull(getLinks(), socket)) {
            unplug(socket.end);

            return;
        }

        pickUpPlug(socket, "tap");
    };

    const handleStopKeyDown = (
        stopKey: string,
        node: PatchBoardNode<T>,
        socket: PatchBoardPlacedSocket | undefined,
        e: KeyboardEvent,
    ) => {
        if (getIsDisabled()) return;

        const isCarrying = CarrierStack.getCarry() !== undefined && CarrierStack.getCarryMode() !== "drag";

        if (e.key === "Escape") {
            if (!isCarrying) return;

            e.preventDefault();
            CarrierStack.end("cancel");

            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            if (isCarrying) {
                CarrierStack.end("drop");

                return;
            }

            if (!socket) {
                pickUpNode(node, "key");

                return;
            }

            if (PatchBoardUtils.getIsFull(getLinks(), socket)) {
                unplug(socket.end);

                return;
            }

            pickUpPlug(socket, "key");

            return;
        }

        if (isCarrying) {
            const nudge = NUDGE_KEYS[e.key];

            if (!nudge) return;

            e.preventDefault();
            CarrierStack.aimAtNudge(
                e.shiftKey
                    ? {
                          x: (nudge.x ?? NOTHING) * COARSE_STEP_FACTOR,
                          y: (nudge.y ?? NOTHING) * COARSE_STEP_FACTOR,
                      }
                    : nudge,
            );

            return;
        }

        if (e.key === "Delete" || e.key === "Backspace") {
            if (!socket) return;

            e.preventDefault();
            unplug(socket.end);

            return;
        }

        if (e.key === "Home" || e.key === "End") {
            const keys = getNodeKeys();

            e.preventDefault();
            focusStop(e.key === "Home" ? keys[NOTHING] : keys[keys.length - SINGLE]);

            return;
        }

        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            focusStop(PatchBoardUtils.getSteppedKey(getStopKeys(), stopKey, e.key === "ArrowRight" ? SINGLE : -SINGLE));

            return;
        }

        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

        e.preventDefault();
        focusStop(
            PatchBoardUtils.getSteppedKey(getNodeKeys(), getNodeKey(node), e.key === "ArrowDown" ? SINGLE : -SINGLE),
        );
    };

    const handleRootClick = (e: MouseEvent) => {
        const carry = CarrierStack.getCarry();

        if (getIsDisabled() || !carry) return;
        if (e.target !== getRootRef()) return;

        dropAtPointer(e);
    };

    createEffect(() => {
        if (!getCarry()) return;

        const trackPoint = (e: PointerEvent) => {
            if (CarrierStack.getCarryMode() !== "tap") return;

            CarrierStack.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        onCleanup(() => {
            document.removeEventListener("pointermove", trackPoint, true);
        });
    });

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        const swallowClick = (e: MouseEvent) => {
            if (!hasPendingClick) return;

            hasPendingClick = false;

            e.preventDefault();
            e.stopPropagation();
        };

        root.addEventListener("click", swallowClick, true);

        onCleanup(() => {
            root.removeEventListener("click", swallowClick, true);
        });
    });

    createEffect(() => {
        if (!getIsDisabled() || !getCarry()) return;

        CarrierStack.end("cancel");
    });

    onCleanup(() => {
        if (CarrierStack.getSourceZone() === zone) CarrierStack.end("cancel");
    });

    return (
        <div
            id={boardId}
            ref={setRootRef}
            class={styles.patchBoardRoot}
            style={{ width: `${getSize().width}px`, height: `${getSize().height}px` }}
            role="list"
            aria-label={getAriaLabel()}
            aria-disabled={getIsDisabled() || undefined}
            onClick={handleRootClick}
        >
            <svg
                class={styles.patchBoardCables}
                viewBox={`0 0 ${getSize().width} ${getSize().height}`}
                aria-hidden="true"
            >
                <Index each={getCableDefs()}>{(getDefs) => <>{props.renderCable(getDefs)}</>}</Index>
            </svg>

            <Index each={getNodes()}>
                {(getNode) => {
                    const getKey = createMemo(() => getNodeKey(getNode()));

                    const getPlacement = createMemo(() =>
                        getPlacements().find((placement) => placement.key === getKey()),
                    );

                    return (
                        <div
                            class={styles.patchBoardSlot}
                            style={{
                                left: `${getPlacement()?.spot.x ?? getNode().spot.x}px`,
                                top: `${getPlacement()?.spot.y ?? getNode().spot.y}px`,
                                width: `${getNode().size.width}px`,
                                height: `${getNode().size.height}px`,
                            }}
                        >
                            <div class={styles.patchBoardNodeHolder}>
                                <InteractionWrapper
                                    sizing={() => "fill"}
                                    isDisabled={() => getNode().isDisabled ?? false}
                                    isTabbable={() => getRovingStop() === getKey()}
                                    extraFlags={() => ({ isCarried: getCarriedNodeKey() === getKey() })}
                                    renderControl={(setElementRef, getFlags) => (
                                        <div
                                            ref={(element) => {
                                                setStopRef(getKey(), element);
                                                setElementRef(element);
                                            }}
                                            class={styles.patchBoardNode}
                                            role="listitem"
                                            aria-label={getNodeLabel(getNode())}
                                            aria-disabled={(getNode().isDisabled ?? false) || undefined}
                                            onPointerDown={(e) => handleNodePointerDown(getNode(), e)}
                                            onClick={(e) => handleNodeClick(getNode(), e)}
                                            onKeyDown={(e) => handleStopKeyDown(getKey(), getNode(), undefined, e)}
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

                                    const getPlaced = createMemo(() =>
                                        PatchBoardUtils.findSocket(getPlacedSockets(), getEnd()),
                                    );

                                    const getStopKey = createMemo(() => PatchBoardUtils.getEndKey(getEnd()));

                                    const getIsTaken = createMemo(
                                        () => PatchBoardUtils.getLinksAt(getLinks(), getEnd()).length > NOTHING,
                                    );

                                    const getIsAimed = createMemo(() => {
                                        const place = getAimedPlace();

                                        return (
                                            place?.kind === "socket" && PatchBoardUtils.getIsSameEnd(place, getEnd())
                                        );
                                    });

                                    const getIsSource = createMemo(() => {
                                        const source = getPlugSource();

                                        return source !== undefined && PatchBoardUtils.getIsSameEnd(source, getEnd());
                                    });

                                    const getIsAllowed = createMemo(() => {
                                        const source = getPlugSource();

                                        return source !== undefined && getIsEndAllowed(source, getEnd());
                                    });

                                    return (
                                        <div
                                            class={styles.patchBoardSocketHolder}
                                            style={{
                                                left: `${(getPlaced()?.point.x ?? NOTHING) - (getPlacement()?.spot.x ?? NOTHING)}px`,
                                                top: `${(getPlaced()?.point.y ?? NOTHING) - (getPlacement()?.spot.y ?? NOTHING)}px`,
                                                width: `${getSocketSize()}px`,
                                                height: `${getSocketSize()}px`,
                                            }}
                                        >
                                            <InteractionWrapper
                                                isDisabled={() =>
                                                    (getNode().isDisabled ?? false) || (getSocket().isDisabled ?? false)
                                                }
                                                isTabbable={() => getRovingStop() === getStopKey()}
                                                extraFlags={() => ({
                                                    kind: getSocket().kind,
                                                    isTaken: getIsTaken(),
                                                    isFull: getPlaced()
                                                        ? PatchBoardUtils.getIsFull(getLinks(), getPlaced()!)
                                                        : false,
                                                    isSource: getIsSource(),
                                                    isAimed: getIsAimed(),
                                                    isAllowed: getIsAllowed(),
                                                })}
                                                renderControl={(setElementRef, getFlags) => (
                                                    <div
                                                        ref={(element) => {
                                                            setStopRef(getStopKey(), element);
                                                            setElementRef(element);
                                                        }}
                                                        class={styles.patchBoardSocket}
                                                        role="button"
                                                        aria-label={`${getEndLabel(getEnd())}, ${getSocket().kind === "in" ? "input" : "output"}${getIsTaken() ? ", connected" : ""}`}
                                                        aria-disabled={
                                                            (getSocket().isDisabled ?? false) ||
                                                            getIsLocked() ||
                                                            undefined
                                                        }
                                                        onPointerDown={(e) => handleSocketPointerDown(getPlaced(), e)}
                                                        onClick={(e) => handleSocketClick(getPlaced(), e)}
                                                        onKeyDown={(e) =>
                                                            handleStopKeyDown(getStopKey(), getNode(), getPlaced(), e)
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
