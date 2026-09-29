import { Fragment, type SlotsType, type VNodeChild, computed, defineComponent, shallowRef, useId } from "vue";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketGeometry,
    BracketStyles,
    BracketUtils,
    NavigatorUtils,
} from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { BracketProps, BracketSlots } from "./Bracket.types";

const NOTHING = 0;

export const Bracket = defineComponent(
    <T,>(props: BracketProps<T>, { slots }: SlotsContext<BracketSlots<T>>) => {
        const boardId = useId();
        const nodeRefs = new Map<string, HTMLElement>();

        const lastFocusedId = shallowRef<string>();
        const hasFocus = shallowRef(false);

        const getOrientation = () => props.orientation ?? BRACKET_DEFAULTS.orientation;
        const getRootSide = () => props.rootSide ?? BRACKET_DEFAULTS.rootSide;

        const layout = computed(() => BracketUtils.computeLayout(props.root));

        const computeGeometry = () =>
            BracketUtils.computeGeometry(layout.value, {
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

        const placementById = computed(
            () => new Map(layout.value.placements.map((placement) => [placement.id, placement])),
        );

        const stops = computed(() => layout.value.placements.filter((placement) => !placement.isDisabled));

        const rovingId = computed(() => BracketUtils.resolveRovingId(stops.value, lastFocusedId.value));

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
            nodeRefs.get(next)?.focus();
        };

        const renderItem = (id: string, geometry: BracketGeometry): VNodeChild => {
            const placement = placementById.value.get(id) ?? BRACKET_MISSING_PLACEMENT;
            const isNodeDisabled = placement.isDisabled;
            const inset = BracketUtils.computeInset(geometry, placement);

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
                            lastFocusedId.value = id;
                            hasFocus.value = true;
                        }}
                        onBlur={() => {
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

        const renderLayers = (geometry: BracketGeometry): VNodeChild =>
            Array.from({ length: layout.value.layerCount }, (_unused, layer) => {
                const headerId = `${boardId}-layer-${layer}`;
                const headerBox = BracketUtils.computeHeaderBox(geometry, layer);

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
                            }}
                        >
                            {callSlot(slots.renderLayerHeader, layer)}
                        </div>

                        <ul class={BracketStyles.bracketList} aria-labelledby={headerId}>
                            {layout.value.placements
                                .filter((placement) => placement.layer === layer)
                                .map((placement) => renderItem(placement.id, geometry))}
                        </ul>
                    </Fragment>
                );
            });

        return () => {
            const geometry = computeGeometry();
            const boardSize = geometry.boardSize;
            const connectors = BracketUtils.computeConnectors(layout.value, geometry, boardId, focusedId.value);
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
                        {connectors.map((defs, index) => (
                            <Fragment key={index}>{callSlot(slots.renderConnector, defs)}</Fragment>
                        ))}
                    </svg>

                    {hasLayerHeaders ? (
                        renderLayers(geometry)
                    ) : (
                        <ul class={BracketStyles.bracketList} aria-label={props.ariaLabel}>
                            {layout.value.placements.map((placement) => renderItem(placement.id, geometry))}
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
            root: null,
            onActivate: null,
        }),
    },
);
