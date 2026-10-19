import {
    Fragment,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    onBeforeUpdate,
    shallowRef,
    useId,
    watch,
} from "vue";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketGeometry,
    type BracketNode,
    type BracketPlacement,
    BracketStyles,
    BracketUtils,
    NavigatorUtils,
    PanZoomUtils,
} from "@thewaver/ss-components";
import { BracketConst } from "@thewaver/ss-components/internal";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { PanZoomVueUtils } from "../../../Abstracts/PanZoom/PanZoomVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { BracketProps, BracketSlots } from "./Bracket.types";

export const Bracket = defineComponent(
    <T,>(props: BracketProps<T>, { slots }: SlotsContext<BracketSlots<T>>) => {
        const boardId = useId();
        const nodeRefs = new Map<string, HTMLElement>();

        const lastFocusedId = shallowRef<string>();
        const hasFocus = shallowRef(false);
        const windowRef = shallowRef<HTMLElement>();
        const hasLayerHeaders = shallowRef(slots.renderLayerHeader !== undefined);

        onBeforeUpdate(() => {
            hasLayerHeaders.value = slots.renderLayerHeader !== undefined;
        });

        const windowSize = ElementObserverVueUtils.useBorderBoxSize(windowRef);

        const getOrientation = () => props.orientation ?? BRACKET_DEFAULTS.orientation;
        const getRootSide = () => props.rootSide ?? BRACKET_DEFAULTS.rootSide;
        const getIsPannable = () => props.isPannable ?? BRACKET_DEFAULTS.isPannable;
        const getIsZoomable = () => props.isZoomable ?? BRACKET_DEFAULTS.isZoomable;
        const getFamilyMargin = () => props.familyMargin ?? BRACKET_DEFAULTS.familyMargin;

        const layout = computed(() => BracketUtils.computeLayout(props.root));

        const geometry = computed(() =>
            BracketUtils.computeGeometry(layout.value, {
                nodeSize: props.nodeSize,
                layerGap: props.layerGap ?? BRACKET_DEFAULTS.layerGap,
                crossGap: props.crossGap ?? BRACKET_DEFAULTS.crossGap,
                orientation: getOrientation(),
                rootSide: getRootSide(),
                headerExtent: hasLayerHeaders.value
                    ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize)
                    : BracketConst.NOTHING,
            }),
        );

        const panZoom = PanZoomVueUtils.use({
            view: useTwoWay(props, "view"),
            windowRef: () => windowRef.value,
            size: windowSize,
            range: () => BracketUtils.computeWholeView(geometry.value),
            minWidth: () => windowSize.value.width / (props.maxScale ?? BRACKET_DEFAULTS.maxScale),
            durationMs: () => props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs,
            isPannable: getIsPannable,
            isZoomable: getIsZoomable,
            getCanCenterEdges: (requested) =>
                (props.isFollowingFamily ?? BRACKET_DEFAULTS.isFollowingFamily) &&
                windowSize.value.width > BracketConst.NOTHING &&
                BracketUtils.computeFamilyInView(
                    layout.value,
                    geometry.value,
                    requested,
                    windowSize.value.height / windowSize.value.width,
                    getFamilyMargin(),
                ) !== undefined,
            onGestureMove: () => followView(),
            onSettle: () => snapToFamily(),
        });

        watchAfterRender([], () => {
            props.onMount?.(panZoom.controller);
        });

        const focusedId = computed(() => (hasFocus.value ? lastFocusedId.value : undefined));

        const family = useTwoWay(props, "family");

        const anchorId = computed(() => BracketUtils.findNodeId(props.root, layout.value, family.value));

        const currentLayer = computed(() => BracketUtils.getFamilyLayer(layout.value, anchorId.value));

        const isFollowingFamily = computed(
            () => panZoom.isActive.value && (props.isFollowingFamily ?? BRACKET_DEFAULTS.isFollowingFamily),
        );

        const computeFamilyInView = () =>
            BracketUtils.computeFamilyInView(
                layout.value,
                geometry.value,
                panZoom.view.value,
                panZoom.aspect.value,
                getFamilyMargin(),
            );

        const isFamilyFramed = computed(() => !isFollowingFamily.value || computeFamilyInView() !== undefined);

        let followedFamily: { anchorId: string | undefined } | undefined;

        const setFamilyByAnchor = (familyAnchorId: string | undefined) => {
            family.value =
                familyAnchorId === undefined ? undefined : BracketUtils.findNode<T>(props.root, familyAnchorId);
        };

        const frameFamily = (familyAnchorId: string | undefined) => {
            panZoom.setView(
                BracketUtils.computeFamilyView(layout.value, geometry.value, familyAnchorId, getFamilyMargin()),
                false,
            );
        };

        const followView = () => {
            if (!isFollowingFamily.value) return;

            const inView = computeFamilyInView();

            if (inView === undefined || inView.anchorId === anchorId.value) return;

            followedFamily = inView;
            setFamilyByAnchor(inView.anchorId);
        };

        const snapToFamily = () => {
            if (!isFollowingFamily.value || !(props.isSnappingToFamily ?? BRACKET_DEFAULTS.isSnappingToFamily)) return;

            const inView = computeFamilyInView();

            if (inView === undefined) {
                panZoom.setView(BracketUtils.computeWholeView(geometry.value), false);

                return;
            }

            followView();
            frameFamily(inView.anchorId);
        };

        watch([geometry, windowSize], (_current, [previousGeometry, previousSize]) => {
            if (!isFollowingFamily.value || previousSize.width <= BracketConst.NOTHING) return;

            const wasFramed =
                BracketUtils.computeFamilyInView(
                    layout.value,
                    previousGeometry,
                    panZoom.requestedView.value,
                    previousSize.height / previousSize.width,
                    getFamilyMargin(),
                ) !== undefined;

            if (wasFramed) frameFamily(anchorId.value);
        });

        watch(anchorId, (nextAnchorId) => {
            const followed = followedFamily;

            followedFamily = undefined;

            if (!isFollowingFamily.value || (followed !== undefined && followed.anchorId === nextAnchorId)) return;

            frameFamily(nextAnchorId);
        });

        const showFamilyOf = (id: string) => {
            const familyAnchorId = BracketUtils.getFamilyAnchorId(id);

            setFamilyByAnchor(familyAnchorId);
        };

        const boardTransform = computed(() => {
            if (!panZoom.isActive.value) return undefined;

            const view = panZoom.shownView.value;
            const scale = PanZoomUtils.computeScale(view, windowSize.value.width);

            return `scale(${scale}) translate(${-view.x.start}px, ${-view.y.start}px)`;
        });

        const placementById = computed(
            () => new Map(layout.value.placements.map((placement) => [placement.id, placement])),
        );

        const stops = computed(() => layout.value.placements.filter((placement) => !placement.isDisabled));

        const rovingId = computed(() => BracketUtils.resolveRovingId(stops.value, lastFocusedId.value));

        const getIsNode = (eventTarget: EventTarget | null) =>
            [...nodeRefs.values()].some((element) => element === eventTarget);

        const revealNode = (id: string) => {
            const placement = placementById.value.get(id);

            if (!panZoom.isActive.value || placement === undefined) return;

            const inset = BracketUtils.computeInset(geometry.value, placement);

            panZoom.controller.showArea({
                x: { start: inset.left, end: inset.left + props.nodeSize.width },
                y: { start: inset.top, end: inset.top + props.nodeSize.height },
            });
        };

        const activate = (id: string) => {
            props.onActivate?.(
                BracketUtils.findNode(props.root, id).value,
                placementById.value.get(id) ?? BRACKET_MISSING_PLACEMENT,
            );
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const roving = rovingId.value;

            if (roving === undefined) return;

            if (NavigatorUtils.getIsActivationKey(e.key)) {
                e.preventDefault();
                activate(roving);

                return;
            }

            const step = BracketUtils.getKeyStep(e.key, getOrientation(), getRootSide());

            if (step === undefined) return;

            const next = BracketUtils.computeStepId(step, roving, stops.value);

            if (next === undefined) return;

            e.preventDefault();
            lastFocusedId.value = next;
            nodeRefs.get(next)?.focus({ preventScroll: panZoom.isActive.value });
        };

        const getHeaderBox = (layer: number) => {
            const box = BracketUtils.computeHeaderBox(geometry.value, layer);

            if (!panZoom.isActive.value) return box;

            const view = panZoom.shownView.value;

            return geometry.value.isHorizontal ? { ...box, top: view.y.start } : { ...box, left: view.x.start };
        };

        const renderItem = (id: string, boardGeometry: BracketGeometry): VNodeChild => {
            const placement: BracketPlacement = placementById.value.get(id) ?? BRACKET_MISSING_PLACEMENT;
            const isNodeDisabled = placement.isDisabled;
            const inset = BracketUtils.computeInset(boardGeometry, placement);

            return (
                <li
                    key={id}
                    class={BracketStyles.bracketItem}
                    style={{
                        left: `${inset.left}px`,
                        top: `${inset.top}px`,
                        width: `${props.nodeSize.width}px`,
                        height: `${props.nodeSize.height}px`,
                    }}
                >
                    <div
                        ref={(target) => {
                            const element = toElement(target);

                            if (element) nodeRefs.set(id, element);
                            else nodeRefs.delete(id);
                        }}
                        class={BracketStyles.bracketNode}
                        role="button"
                        tabindex={isNodeDisabled ? undefined : id === rovingId.value ? 0 : -1}
                        aria-disabled={isNodeDisabled || undefined}
                        onFocus={() => {
                            showFamilyOf(id);
                            lastFocusedId.value = id;
                            hasFocus.value = true;
                            revealNode(id);
                        }}
                        onBlur={(e: FocusEvent) => {
                            if (getIsNode(e.relatedTarget)) return;

                            hasFocus.value = false;
                        }}
                        onClick={() => {
                            if (isNodeDisabled) return;

                            lastFocusedId.value = id;
                            activate(id);
                        }}
                    >
                        {callSlot(slots.renderNode, {
                            node: BracketUtils.findNode(props.root, id) as BracketNode<T>,
                            state: {
                                placement,
                                isFocused: focusedId.value === id,
                                isOnFocusedRoute: BracketUtils.getIsOnRoute(id, focusedId.value),
                            },
                        })}
                    </div>
                </li>
            );
        };

        const renderLayers = (boardGeometry: BracketGeometry): VNodeChild =>
            Array.from({ length: layout.value.layerCount }, (_unused, layer) => {
                const headerId = `${boardId}-layer-${layer}`;
                const headerBox = getHeaderBox(layer);

                return (
                    <Fragment key={layer}>
                        <div
                            id={headerId}
                            class={BracketStyles.bracketLayerHeader}
                            style={{
                                left: `${headerBox.left}px`,
                                top: `${headerBox.top}px`,
                                width: `${headerBox.width}px`,
                                height: `${headerBox.height}px`,
                                pointerEvents: panZoom.isActive.value ? "none" : undefined,
                            }}
                        >
                            {callSlot(slots.renderLayerHeader, {
                                layer,
                                state: { isCurrent: isFamilyFramed.value && currentLayer.value === layer },
                            })}
                        </div>

                        <ul class={BracketStyles.bracketList} aria-labelledby={headerId}>
                            {layout.value.placements
                                .filter((placement) => placement.layer === layer)
                                .map((placement) => renderItem(placement.id, boardGeometry))}
                        </ul>
                    </Fragment>
                );
            });

        return () => {
            const boardGeometry = geometry.value;
            const boardSize = boardGeometry.boardSize;
            const connectors = BracketUtils.computeConnectors(layout.value, boardGeometry, boardId, focusedId.value);

            const board = (
                <div
                    class={BracketStyles.bracketRoot}
                    style={{
                        width: `${boardSize.width}px`,
                        height: `${boardSize.height}px`,
                        transform: boardTransform.value,
                    }}
                    role={hasLayerHeaders.value ? "group" : undefined}
                    aria-label={hasLayerHeaders.value ? props.ariaLabel : undefined}
                    onKeydown={handleKeyDown}
                >
                    <svg
                        class={BracketStyles.bracketConnectors}
                        viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
                        aria-hidden="true"
                    >
                        {connectors.map((defs) => (
                            <Fragment key={defs.id}>{callSlot(slots.renderConnector, defs)}</Fragment>
                        ))}
                    </svg>

                    {hasLayerHeaders.value ? (
                        renderLayers(boardGeometry)
                    ) : (
                        <ul class={BracketStyles.bracketList} aria-label={props.ariaLabel}>
                            {layout.value.placements.map((placement) => renderItem(placement.id, boardGeometry))}
                        </ul>
                    )}
                </div>
            );

            if (!panZoom.isActive.value) return board;

            return (
                <div
                    ref={windowRef}
                    class={BracketStyles.bracketWindow}
                    style={{
                        touchAction: getIsPannable() || getIsZoomable() ? "none" : undefined,
                        userSelect: getIsPannable() ? "none" : undefined,
                    }}
                    onPointerdown={(e: PointerEvent) => panZoom.gestures.press(e)}
                    onPointermove={(e: PointerEvent) => panZoom.gestures.move(e, e.currentTarget as HTMLElement)}
                    onPointerup={(e: PointerEvent) => panZoom.gestures.release(e, e.currentTarget as HTMLElement)}
                    onPointercancel={(e: PointerEvent) => panZoom.gestures.release(e, e.currentTarget as HTMLElement)}
                    onWheel={(e: WheelEvent) => panZoom.gestures.wheel(e)}
                    onScroll={(e: Event) => {
                        const element = e.currentTarget as HTMLElement;

                        element.scrollLeft = BracketConst.NOTHING;
                        element.scrollTop = BracketConst.NOTHING;
                    }}
                >
                    {board}
                </div>
            );
        };
    },
    {
        name: "Bracket",
        slots: Object as SlotsType<BracketSlots<any>>,
        props: declareProps<BracketProps<unknown>>({
            "nodeSize": null,
            "layerGap": null,
            "crossGap": null,
            "orientation": null,
            "rootSide": null,
            "ariaLabel": null,
            "layerHeaderSize": null,
            "transitionDurationMs": null,
            "root": null,
            "onActivate": null,
            "isPannable": Boolean,
            "isZoomable": Boolean,
            "maxScale": null,
            "isFollowingFamily": Boolean,
            "isSnappingToFamily": Boolean,
            "familyMargin": null,
            "family": null,
            "onUpdate:family": null,
            "view": null,
            "onUpdate:view": null,
            "onMount": null,
        }),
    },
);
