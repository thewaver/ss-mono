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
    PanZoomUtils,
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
import { PatchBoardConst } from "@thewaver/ss-components/internal";

import { CarrierVueUtils } from "../../../Abstracts/Carrier/CarrierVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { PanZoomVueUtils } from "../../../Abstracts/PanZoom/PanZoomVue.utils";
import { LabelVueUtils } from "../../../Essentials/Input/Label/LabelVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { PatchBoardProps, PatchBoardSlots } from "./PatchBoard.types";

export const PatchBoard = defineComponent(
    <T,>(props: PatchBoardProps<T>, { slots }: SlotsContext<PatchBoardSlots<T>>) => {
        const nodes = useTwoWay(props, "nodes");
        const links = useTwoWay(props, "links");

        const boardId = useId();
        const nodeHintId = useId();
        const socketHintId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const windowRef = shallowRef<HTMLDivElement>();
        const stopRefs = new Map<string, HTMLElement>();

        const focusedStop = shallowRef<string>();

        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getOrientation = () => props.orientation ?? PATCH_BOARD_DEFAULTS.orientation;
        const getIsPannable = () => props.isPannable ?? PATCH_BOARD_DEFAULTS.isPannable;
        const getIsZoomable = () => props.isZoomable ?? PATCH_BOARD_DEFAULTS.isZoomable;

        const windowSize = ElementObserverVueUtils.useBorderBoxSize(windowRef);

        const panZoom = PanZoomVueUtils.use({
            view: useTwoWay(props, "view"),
            windowRef: () => windowRef.value,
            size: windowSize,
            range: () => PanZoomUtils.toFullView(PatchBoardConst.FULL_WIDTH, props.heightRatio),
            minWidth: () => PatchBoardConst.FULL_WIDTH / (props.maxScale ?? PATCH_BOARD_DEFAULTS.maxScale),
            durationMs: () => props.transitionDurationMs ?? PATCH_BOARD_DEFAULTS.transitionDurationMs,
            isPannable: getIsPannable,
            isZoomable: getIsZoomable,
        });

        watchAfterRender([], () => {
            props.onMount?.(panZoom.controller);
        });

        const getLayoutWidth = () => props.boardWidth ?? windowSize.value.width;

        const revealStop = (stopKey: string) => {
            const root = rootRef.value;
            const element = stopRefs.get(stopKey);

            if (!panZoom.isActive.value || !root || !element) return;

            const board = root.getBoundingClientRect();
            const stop = element.getBoundingClientRect();

            if (board.width === PatchBoardConst.NOTHING) return;

            panZoom.controller.showArea({
                x: { start: (stop.left - board.left) / board.width, end: (stop.right - board.left) / board.width },
                y: { start: (stop.top - board.top) / board.width, end: (stop.bottom - board.top) / board.width },
            });
        };

        const getIsOnStop = (target: EventTarget | null) =>
            [...stopRefs.values()].some((element) => target instanceof Node && element.contains(target));

        const carryState = CarrierVueUtils.useCarry();
        const isTargetAllowed = CarrierVueUtils.useIsTargetAllowed();

        const focusStop = (stopKey: string | undefined) => {
            if (stopKey === undefined) return;

            focusedStop.value = stopKey;
            stopRefs.get(stopKey)?.focus({ preventScroll: panZoom.isActive.value });
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

            return focused !== undefined && stopKeys.includes(focused) ? focused : stopKeys[PatchBoardConst.NOTHING];
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

            if (panZoom.isActive.value) {
                revealStop(key);

                return;
            }

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
                            (placed?.point.x ?? PatchBoardConst.NOTHING) -
                                (placement?.spot.x ?? PatchBoardConst.NOTHING),
                        ),
                        top: PlacementUtils.toContainerWidth(
                            (placed?.point.y ?? PatchBoardConst.NOTHING) -
                                (placement?.spot.y ?? PatchBoardConst.NOTHING),
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
                                            revealStop(stopKey);
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
                                                revealStop(nodeKey);
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

            const isActive = panZoom.isActive.value;
            let transform: string | undefined;

            if (isActive) {
                const shown = panZoom.shownView.value;
                const width = getLayoutWidth();
                const scale = PanZoomUtils.computeScale(shown, windowSize.value.width) / width;

                transform = `scale(${scale}) translate(${-shown.x.start * width}px, ${-shown.y.start * width}px)`;
            }

            const boardElement = (
                <div
                    id={boardId}
                    ref={rootRef}
                    class={PatchBoardStyles.patchBoardRoot}
                    style={{
                        width: isActive && props.boardWidth !== undefined ? `${getLayoutWidth()}px` : undefined,
                        transform,
                    }}
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
                        viewBox={`0 0 ${PatchBoardConst.FULL_WIDTH} ${props.heightRatio}`}
                        aria-hidden="true"
                    >
                        {cableDefs.map((defs) => (
                            <Fragment key={defs.key}>{callSlot(slots.renderCable, defs)}</Fragment>
                        ))}
                    </svg>

                    {nodes.value.map(renderNode)}
                </div>
            );

            if (!isActive) return boardElement;

            return (
                <div
                    ref={windowRef}
                    class={PatchBoardStyles.patchBoardWindow}
                    style={{
                        "aspect-ratio": `${PatchBoardConst.FULL_WIDTH} / ${props.heightRatio}`,
                        "touch-action": getIsPannable() || getIsZoomable() ? "none" : undefined,
                        "user-select": getIsPannable() ? "none" : undefined,
                    }}
                    onPointerdown={(e: PointerEvent) => {
                        if (getIsOnStop(e.target)) return;

                        panZoom.gestures.press(e);
                    }}
                    onPointermove={(e: PointerEvent) => panZoom.gestures.move(e, e.currentTarget as HTMLElement)}
                    onPointerup={(e: PointerEvent) => panZoom.gestures.release(e, e.currentTarget as HTMLElement)}
                    onPointercancel={(e: PointerEvent) => panZoom.gestures.release(e, e.currentTarget as HTMLElement)}
                    onWheel={(e: WheelEvent) => panZoom.gestures.wheel(e)}
                    onScroll={(e: Event) => {
                        const element = e.currentTarget as HTMLElement;

                        element.scrollLeft = PatchBoardConst.NOTHING;
                        element.scrollTop = PatchBoardConst.NOTHING;
                    }}
                >
                    {boardElement}
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
            "transitionDurationMs": null,
            "isPannable": Boolean,
            "isZoomable": Boolean,
            "maxScale": null,
            "boardWidth": null,
            "view": null,
            "onUpdate:view": null,
            "onMount": null,
        }),
    },
);
