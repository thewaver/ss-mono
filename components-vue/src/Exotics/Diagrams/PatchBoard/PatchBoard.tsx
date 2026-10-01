import {
    type ComponentPublicInstance,
    Fragment,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    onScopeDispose,
    shallowRef,
    useId,
} from "vue";

import {
    CarrierUtils,
    type CarrierZone,
    LiveAnnouncerUtils,
    PATCH_BOARD_DEFAULTS,
    type PatchBoardCarry,
    type PatchBoardNode,
    type PatchBoardNodeFlags,
    type PatchBoardPlace,
    type PatchBoardPlacedSocket,
    type PatchBoardSocketFlags,
    PatchBoardStyles,
    PatchBoardUtils,
    PlacementUtils,
} from "@thewaver/ss-components";

import { CarrierVueUtils } from "../../../Abstracts/Carrier/CarrierVue.utils";
import { LabelVueUtils } from "../../../Essentials/Input/Label/LabelVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { PatchBoardProps, PatchBoardSlots } from "./PatchBoard.types";

const NOTHING = 0;
const FULL_WIDTH = 1;

export const PatchBoard = defineComponent(
    <T,>(props: PatchBoardProps<T>, { slots }: SlotsContext<PatchBoardSlots<T>>) => {
        const nodes = useTwoWay(props, "nodes");
        const links = useTwoWay(props, "links");

        const boardId = useId();
        const nodeHintId = useId();
        const socketHintId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const stopRefs = new Map<string, HTMLElement>();

        const focusedStop = shallowRef<string>();

        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getOrientation = () => props.orientation ?? PATCH_BOARD_DEFAULTS.orientation;

        const carryState = CarrierVueUtils.useCarry();
        const isTargetAllowed = CarrierVueUtils.useIsTargetAllowed();

        const focusStop = (stopKey: string | undefined) => {
            if (stopKey === undefined) return;

            focusedStop.value = stopKey;
            stopRefs.get(stopKey)?.focus();
        };

        const board = PatchBoardUtils.createBoard<T>({
            getZone: () => zone,
            getGroupId: () => props.groupId,
            getLabel: () => props.ariaLabel,
            getRootRef: () => rootRef.value,
            getIsDisabled,
            getIsLocked: () => props.isLocked ?? false,
            getAnnouncements: () => props.announcements,
            getHeightRatio: () => props.heightRatio,
            getSocketReach: () => props.socketReach ?? PATCH_BOARD_DEFAULTS.socketReach,
            getStepSize: () => props.stepSize ?? PATCH_BOARD_DEFAULTS.stepSize,
            getSnapSpot: () => props.computeSnapSpot,
            getCanLink: () => props.computeCanLink,
            getNodes: () => nodes.value,
            getLinks: () => links.value,
            getPlacements: () => placements.value,
            getPlacedSocketByEndKey: () => placedByEndKey.value,
            computeNodeKey: (value) => props.computeNodeKey(value),
            computeNodeLabel: (value) => props.computeNodeLabel(value),
            updateNodes: (update) => {
                nodes.value = update(nodes.value);
            },
            updateLinks: (update) => {
                links.value = update(links.value);
            },
            focusStop,
            onLink: (link) => props.onLink?.(link),
            onUnlink: (link) => props.onUnlink?.(link),
            onMove: (nodeKey, spot) => props.onMove?.(nodeKey, spot),
        });

        const zone: CarrierZone = CarrierVueUtils.useZone(board.zone);

        const isSource = computed(() => carryState.value !== undefined && carryState.value.from === zone);

        const carriedValue = computed(() =>
            isSource.value ? (carryState.value!.carry.value as PatchBoardCarry<T>) : undefined,
        );

        const carriedNodeKey = computed(() =>
            carriedValue.value?.kind === "node" ? carryState.value?.carry.key : undefined,
        );

        const plugSource = computed(() => (carriedValue.value?.kind === "plug" ? carriedValue.value.from : undefined));

        const aimedPlace = computed(() =>
            isSource.value ? (carryState.value!.toPlace as PatchBoardPlace | undefined) : undefined,
        );

        const placements = computed(() =>
            PatchBoardUtils.getPlacements(nodes.value, props.computeNodeKey, carriedNodeKey.value, aimedPlace.value),
        );

        const placementByKey = computed(() => new Map(placements.value.map((placement) => [placement.key, placement])));

        const placedByEndKey = computed(() =>
            PatchBoardUtils.getPlacedSocketByEndKey(
                PatchBoardUtils.getPlacedSockets(placements.value, getOrientation()),
            ),
        );

        const rovingStop = computed(() => {
            const stopKeys = PatchBoardUtils.getStopKeys(placements.value);
            const focused = focusedStop.value;

            return focused !== undefined && stopKeys.includes(focused) ? focused : stopKeys[NOTHING];
        });

        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        watchAfterRender([isSource], ([isCarrying]) => (isCarrying ? board.observeTapAim() : undefined));

        watchAfterRender([rootRef], ([root]) => (root ? board.observeClicks(root) : undefined));

        const scrollKey = computed(() => {
            const place = aimedPlace.value;

            if (!place || place.kind === "free" || carryState.value?.mode !== "key") return undefined;

            return place.kind === "spot" ? carriedNodeKey.value : PatchBoardUtils.getEndKey(place);
        });

        watchAfterRender([scrollKey, aimedPlace], ([key]) => {
            if (key === undefined) return;

            stopRefs.get(key)?.scrollIntoView({ block: "nearest", inline: "nearest" });
        });

        watchAfterRender([getIsDisabled, isSource], ([isDisabled, isCarrying]) => {
            if (!isDisabled || !isCarrying) return;

            CarrierUtils.end("cancel");
        });

        onScopeDispose(board.cancel);

        const setStopRef = (stopKey: string, target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (element) {
                stopRefs.set(stopKey, element);

                return;
            }

            stopRefs.delete(stopKey);
        };

        const renderSocket = (
            node: PatchBoardNode<T>,
            nodeKey: string,
            socket: PatchBoardNode<T>["sockets"][number],
        ): VNodeChild => {
            const end = { nodeKey, socketId: socket.id };
            const stopKey = PatchBoardUtils.getEndKey(end);
            const placed: PatchBoardPlacedSocket | undefined = placedByEndKey.value.get(stopKey);
            const placement = placementByKey.value.get(nodeKey);
            const socketSize = props.socketSize ?? PATCH_BOARD_DEFAULTS.socketSize;
            const socketFlags = PatchBoardUtils.getSocketFlags(end, socket.kind, {
                placed,
                links: links.value,
                aimedPlace: aimedPlace.value,
                plugSource: plugSource.value,
                getIsEndAllowed: board.getIsEndAllowed,
            });

            return (
                <div
                    key={socket.id}
                    class={PatchBoardStyles.patchBoardSocketHolder}
                    style={{
                        left: PlacementUtils.toContainerWidth(
                            (placed?.point.x ?? NOTHING) - (placement?.spot.x ?? NOTHING),
                        ),
                        top: PlacementUtils.toContainerWidth(
                            (placed?.point.y ?? NOTHING) - (placement?.spot.y ?? NOTHING),
                        ),
                        width: PlacementUtils.toContainerWidth(socketSize),
                        height: PlacementUtils.toContainerWidth(socketSize),
                    }}
                >
                    <InteractionWrapper
                        sizing={"fill"}
                        isDisabled={(node.isDisabled ?? false) || (socket.isDisabled ?? false)}
                        isFocusableWhenDisabled={!getIsDisabled()}
                        isTabbable={rovingStop.value === stopKey}
                        extraFlags={socketFlags}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <div
                                        ref={(target) => {
                                            setStopRef(stopKey, target);
                                            setElementRef(target);
                                        }}
                                        class={PatchBoardStyles.patchBoardSocket}
                                        role="button"
                                        aria-label={props.announcements.computeSocketLabel(
                                            board.getEndLabel(end),
                                            socket.kind,
                                            socketFlags.isTaken,
                                        )}
                                        aria-disabled={placed?.isDisabled || props.isLocked || undefined}
                                        aria-describedby={socketHintId}
                                        onPointerdown={(e) => board.handleSocketPointerDown(placed, e)}
                                        onClick={(e) => board.handleSocketClick(placed, e)}
                                        onKeydown={(e) => board.handleStopKeyDown(stopKey, node, placed, e)}
                                        onFocusin={() => {
                                            focusedStop.value = stopKey;
                                        }}
                                    >
                                        {callSlot(slots.renderSocket, { socket, flags })}
                                    </div>
                                ),
                            } satisfies InteractionWrapperSlots<PatchBoardSocketFlags>
                        }
                    </InteractionWrapper>
                </div>
            );
        };

        const renderNode = (node: PatchBoardNode<T>): VNodeChild => {
            const nodeKey = props.computeNodeKey(node.value);
            const placement = placementByKey.value.get(nodeKey);

            return (
                <div
                    key={nodeKey}
                    class={PatchBoardStyles.patchBoardSlot}
                    role="group"
                    style={{
                        left: PlacementUtils.toContainerWidth(placement?.spot.x ?? node.spot.x),
                        top: PlacementUtils.toContainerWidth(placement?.spot.y ?? node.spot.y),
                        width: PlacementUtils.toContainerWidth(node.sizeShare.width),
                        height: PlacementUtils.toContainerWidth(node.sizeShare.height),
                    }}
                >
                    <div class={PatchBoardStyles.patchBoardNodeHolder}>
                        <InteractionWrapper
                            sizing={"fill"}
                            isDisabled={node.isDisabled ?? false}
                            isFocusableWhenDisabled={!getIsDisabled()}
                            isTabbable={rovingStop.value === nodeKey}
                            extraFlags={{ isCarried: carriedNodeKey.value === nodeKey }}
                        >
                            {
                                {
                                    renderControl: ({ setElementRef, flags }) => (
                                        <div
                                            ref={(target) => {
                                                setStopRef(nodeKey, target);
                                                setElementRef(target);
                                            }}
                                            class={PatchBoardStyles.patchBoardNode}
                                            role="button"
                                            aria-label={props.computeNodeLabel(node.value)}
                                            aria-disabled={(node.isDisabled ?? false) || undefined}
                                            aria-describedby={nodeHintId}
                                            onPointerdown={(e) =>
                                                board.handleNodePointerDown(node, e, e.currentTarget as HTMLElement)
                                            }
                                            onClick={(e) =>
                                                board.handleNodeClick(node, e, e.currentTarget as HTMLElement)
                                            }
                                            onKeydown={(e) => board.handleStopKeyDown(nodeKey, node, undefined, e)}
                                            onFocusin={() => {
                                                focusedStop.value = nodeKey;
                                            }}
                                        >
                                            {callSlot(slots.renderNode, { node, flags })}
                                        </div>
                                    ),
                                } satisfies InteractionWrapperSlots<PatchBoardNodeFlags>
                            }
                        </InteractionWrapper>
                    </div>

                    {node.sockets.map((socket) => renderSocket(node, nodeKey, socket))}
                </div>
            );
        };

        return () => {
            const cableDefs = PatchBoardUtils.getCableDefs(
                links.value,
                placedByEndKey.value,
                getOrientation(),
                plugSource.value && aimedPlace.value
                    ? {
                          key: `${boardId}-pending`,
                          from: plugSource.value,
                          place: aimedPlace.value,
                          isAllowed: isTargetAllowed.value,
                      }
                    : undefined,
            );

            return (
                <div
                    id={boardId}
                    ref={rootRef}
                    class={PatchBoardStyles.patchBoardRoot}
                    role="group"
                    aria-label={ariaLabel.value}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={(e) => board.handleRootClick(e)}
                >
                    <div
                        class={PatchBoardStyles.patchBoardSpacer}
                        style={{ height: PlacementUtils.toContainerWidth(props.heightRatio) }}
                        aria-hidden="true"
                    />
                    <div id={nodeHintId} class={PatchBoardStyles.patchBoardHint}>
                        {props.announcements.nodeRestingKeyHint}
                    </div>
                    <div id={socketHintId} class={PatchBoardStyles.patchBoardHint}>
                        {props.announcements.socketRestingKeyHint}
                    </div>
                    <svg
                        class={PatchBoardStyles.patchBoardCables}
                        viewBox={`0 0 ${FULL_WIDTH} ${props.heightRatio}`}
                        aria-hidden="true"
                    >
                        {cableDefs.map((defs) => (
                            <Fragment key={defs.key}>{callSlot(slots.renderCable, defs)}</Fragment>
                        ))}
                    </svg>

                    {nodes.value.map(renderNode)}
                </div>
            );
        };
    },
    {
        name: "PatchBoard",
        slots: Object as SlotsType<PatchBoardSlots<any>>,
        props: declareProps<PatchBoardProps<unknown>>({
            "groupId": null,
            "ariaLabel": null,
            "announcements": null,
            "heightRatio": null,
            "orientation": null,
            "socketSize": null,
            "socketReach": null,
            "stepSize": null,
            "computeSnapSpot": null,
            "isDisabled": Boolean,
            "isLocked": Boolean,
            "nodes": null,
            "onUpdate:nodes": null,
            "links": null,
            "onUpdate:links": null,
            "computeNodeKey": null,
            "computeNodeLabel": null,
            "computeCanLink": null,
            "onLink": null,
            "onUnlink": null,
            "onMove": null,
        }),
    },
);
