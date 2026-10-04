import {
    Fragment,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    nextTick,
    onScopeDispose,
    shallowRef,
    useId,
    watch,
} from "vue";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketArrangement,
    type BracketGeometry,
    BracketStyles,
    BracketUtils,
    NavigatorUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { BracketProps, BracketSlots } from "./Bracket.types";

const NOTHING = 0;

export const Bracket = defineComponent(
    <T,>(props: BracketProps<T>, { slots }: SlotsContext<BracketSlots<T>>) => {
        const boardId = useId();
        const nodeRefs = new Map<string, HTMLElement>();

        let isStepping = false;

        const lastFocusedId = shallowRef<string>();
        const hasFocus = shallowRef(false);
        const glideFrom = shallowRef<BracketArrangement>();

        const glideClock = TreemapUtils.createZoomClock();

        const progress = useStore(glideClock);

        const getOrientation = () => props.orientation ?? BRACKET_DEFAULTS.orientation;
        const getRootSide = () => props.rootSide ?? BRACKET_DEFAULTS.rootSide;

        const layout = computed(() => BracketUtils.computeLayout(props.root));

        const isFamilyView = computed(() => (props.view ?? BRACKET_DEFAULTS.view) === "family");

        const extent = computed(() =>
            isFamilyView.value ? BracketUtils.computeFamilyExtent(layout.value) : layout.value,
        );

        const computeGeometry = () =>
            BracketUtils.computeGeometry(extent.value, {
                nodeSize: props.nodeSize,
                layerGap: props.layerGap ?? BRACKET_DEFAULTS.layerGap,
                crossGap: props.crossGap ?? BRACKET_DEFAULTS.crossGap,
                orientation: getOrientation(),
                rootSide: getRootSide(),
                headerExtent: slots.renderLayerHeader
                    ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize)
                    : NOTHING,
            });

        const focusedId = computed(() => (hasFocus.value ? lastFocusedId.value : undefined));

        const anchorId = computed(() => BracketUtils.getFamilyAnchorId(focusedId.value));

        const computeArrangement = (id: string | undefined) =>
            BracketUtils.computeFamilyArrangement(layout.value, computeGeometry(), extent.value, id);

        const target = computed(() => (isFamilyView.value ? computeArrangement(anchorId.value) : undefined));

        const placementById = computed(
            () => new Map(layout.value.placements.map((placement) => [placement.id, placement])),
        );

        const stops = computed(() => layout.value.placements.filter((placement) => !placement.isDisabled));

        const unfoldedStops = computed(() =>
            stops.value.filter((placement) => !target.value?.nodes[placement.id]?.isFolded),
        );

        const rovingId = computed(() => BracketUtils.resolveRovingId(unfoldedStops.value, lastFocusedId.value));

        const getIsNode = (eventTarget: EventTarget | null) =>
            [...nodeRefs.values()].some((element) => element === eventTarget);

        onScopeDispose(glideClock.stop);

        watch(anchorId, (_next, previous) => {
            if (!isFamilyView.value) return;

            glideFrom.value = BracketUtils.computeShownArrangement(
                glideFrom.value,
                computeArrangement(previous),
                progress.value,
            );
            glideClock.start(props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs);
        });

        watch(
            [isFamilyView, anchorId],
            ([isFamily, id]) => {
                if (!isFamily) return;

                props.onFamilyChange?.(
                    id === undefined ? undefined : BracketUtils.findNode(props.root, id).value,
                    id === undefined ? undefined : placementById.value.get(id),
                );
            },
            { immediate: true },
        );

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
            isStepping = true;
            lastFocusedId.value = next;
            void nextTick(() => {
                nodeRefs.get(next)?.focus();
                isStepping = false;
            });
        };

        const renderItem = (
            id: string,
            geometry: BracketGeometry,
            shown: BracketArrangement | undefined,
        ): VNodeChild => {
            const placement = placementById.value.get(id) ?? BRACKET_MISSING_PLACEMENT;
            const isNodeDisabled = placement.isDisabled;
            const frame = shown?.nodes[id];
            const inset = frame ?? BracketUtils.computeInset(geometry, placement);
            const isFolded = target.value?.nodes[id]?.isFolded ?? false;

            return (
                <li
                    key={id}
                    class={BracketStyles.bracketItem}
                    style={{
                        left: `${inset.left}px`,
                        top: `${inset.top}px`,
                        width: `${props.nodeSize.width}px`,
                        height: `${props.nodeSize.height}px`,
                        opacity: frame?.opacity,
                        visibility: BracketUtils.getIsFrameHidden(frame) ? "hidden" : undefined,
                    }}
                    aria-hidden={isFolded ? "true" : undefined}
                    inert={isFolded || undefined}
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
                            lastFocusedId.value = id;
                            hasFocus.value = true;
                        }}
                        onBlur={(e: FocusEvent) => {
                            if (isStepping || getIsNode(e.relatedTarget)) return;

                            hasFocus.value = false;
                        }}
                        onClick={() => {
                            if (isNodeDisabled) return;

                            lastFocusedId.value = id;
                            activate(id);
                        }}
                    >
                        {callSlot(slots.renderNode, {
                            node: BracketUtils.findNode(props.root, id),
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

        const renderLayers = (geometry: BracketGeometry, shown: BracketArrangement | undefined): VNodeChild =>
            Array.from({ length: layout.value.layerCount }, (_unused, layer) => {
                const headerId = `${boardId}-layer-${layer}`;
                const headerBox = BracketUtils.computeHeaderBox(geometry, layer);
                const headerFrame = shown?.headers[layer];
                const isHeaderFolded = target.value?.headers[layer]?.isFolded ?? false;

                return (
                    <Fragment key={layer}>
                        <div
                            id={headerId}
                            class={BracketStyles.bracketLayerHeader}
                            style={{
                                left: `${headerFrame?.left ?? headerBox.left}px`,
                                top: `${headerFrame?.top ?? headerBox.top}px`,
                                width: `${headerBox.width}px`,
                                height: `${headerBox.height}px`,
                                opacity: headerFrame?.opacity,
                                visibility: BracketUtils.getIsFrameHidden(headerFrame) ? "hidden" : undefined,
                            }}
                            aria-hidden={isHeaderFolded ? "true" : undefined}
                        >
                            {callSlot(slots.renderLayerHeader, layer)}
                        </div>

                        <ul
                            class={BracketStyles.bracketList}
                            aria-labelledby={headerId}
                            aria-hidden={isHeaderFolded ? "true" : undefined}
                        >
                            {layout.value.placements
                                .filter((placement) => placement.layer === layer)
                                .map((placement) => renderItem(placement.id, geometry, shown))}
                        </ul>
                    </Fragment>
                );
            });

        return () => {
            const geometry = computeGeometry();
            const boardSize = geometry.boardSize;
            const shown =
                target.value && BracketUtils.computeShownArrangement(glideFrom.value, target.value, progress.value);
            const connectors = BracketUtils.computeConnectors(
                layout.value,
                geometry,
                boardId,
                focusedId.value,
                shown?.nodes,
            );
            const hasLayerHeaders = slots.renderLayerHeader !== undefined;

            return (
                <div
                    class={BracketStyles.bracketRoot}
                    style={{ width: `${boardSize.width}px`, height: `${boardSize.height}px` }}
                    role={hasLayerHeaders ? "group" : undefined}
                    aria-label={hasLayerHeaders ? props.ariaLabel : undefined}
                    onKeydown={handleKeyDown}
                >
                    <svg
                        class={BracketStyles.bracketConnectors}
                        viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
                        aria-hidden="true"
                    >
                        {connectors.map((defs, index) =>
                            shown ? (
                                <g
                                    key={index}
                                    style={{ opacity: BracketUtils.computeConnectorOpacity(shown.nodes, defs) }}
                                >
                                    {callSlot(slots.renderConnector, defs)}
                                </g>
                            ) : (
                                <Fragment key={index}>{callSlot(slots.renderConnector, defs)}</Fragment>
                            ),
                        )}
                    </svg>

                    {hasLayerHeaders ? (
                        renderLayers(geometry, shown)
                    ) : (
                        <ul class={BracketStyles.bracketList} aria-label={props.ariaLabel}>
                            {layout.value.placements.map((placement) => renderItem(placement.id, geometry, shown))}
                        </ul>
                    )}
                </div>
            );
        };
    },
    {
        name: "Bracket",
        slots: Object as SlotsType<BracketSlots<any>>,
        props: declareProps<BracketProps<unknown>>({
            nodeSize: null,
            layerGap: null,
            crossGap: null,
            orientation: null,
            rootSide: null,
            ariaLabel: null,
            layerHeaderSize: null,
            view: null,
            transitionDurationMs: null,
            root: null,
            onActivate: null,
            onFamilyChange: null,
        }),
    },
);
