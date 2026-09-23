import { For, Index, Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { access } from "../../Utils/propUtils";
import { BRACKET_DEFAULTS } from "./Bracket.const";
import type { BracketConnectorDefs, BracketNode, BracketPlacement, BracketProps, BracketStep } from "./Bracket.types";
import { BracketUtils } from "./Bracket.utils";

import * as styles from "./Bracket.css";

const HALF = 0.5;
const NOTHING = 0;
const SINGLE = 1;

const MISSING_PLACEMENT: BracketPlacement = {
    id: "",
    parentId: undefined,
    childIds: [],
    layer: 0,
    cross: 0,
    isDisabled: true,
};

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = createUniqueId();

    const [getNodeRefs, setNodeRefs] = createSignal<Record<string, HTMLElement | undefined>>({});
    const [getLastFocusedId, setLastFocusedId] = createSignal<string>();
    const [getHasFocus, setHasFocus] = createSignal(false);

    const getRootNode = createMemo(() => access(props.root));

    const getLayout = createMemo(() => BracketUtils.computeLayout(getRootNode()));

    const getNodeSize = createMemo(() => access(props.nodeSize));

    const getLayerGap = createMemo(() => access(props.layerGap) ?? BRACKET_DEFAULTS.layerGap);

    const getCrossGap = createMemo(() => access(props.crossGap) ?? BRACKET_DEFAULTS.crossGap);

    const getOrientation = createMemo(() => access(props.orientation) ?? BRACKET_DEFAULTS.orientation);

    const getRootSide = createMemo(() => access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide);

    const getIsHorizontal = createMemo(() => getOrientation() === "horizontal");

    const getHeaderExtent = createMemo(() =>
        props.renderLayerHeader ? (access(props.layerHeaderSize) ?? BRACKET_DEFAULTS.layerHeaderSize) : NOTHING,
    );

    const getFocusedId = createMemo(() => (getHasFocus() ? getLastFocusedId() : undefined));

    const getLayerExtent = createMemo(() => (getIsHorizontal() ? getNodeSize().width : getNodeSize().height));

    const getCrossExtent = createMemo(() => (getIsHorizontal() ? getNodeSize().height : getNodeSize().width));

    const getLayerPitch = createMemo(() => getLayerExtent() + getLayerGap());

    const getCrossPitch = createMemo(() => getCrossExtent() + getCrossGap());

    const getLayerSpan = createMemo(() => getLayout().layerCount * getLayerPitch() - getLayerGap());

    const getCrossSpan = createMemo(() => getHeaderExtent() + getLayout().leafCount * getCrossPitch() - getCrossGap());

    const getBoardSize = createMemo(() =>
        getIsHorizontal()
            ? { width: getLayerSpan(), height: getCrossSpan() }
            : { width: getCrossSpan(), height: getLayerSpan() },
    );

    const getNodeAt = (id: string): BracketNode<T> => {
        const path = id.split(".").slice(SINGLE).map(Number);

        return path.reduce<BracketNode<T>>((node, index) => node.children![index], getRootNode());
    };

    const getLayerStart = (layer: number) => {
        const fromStart = layer * getLayerPitch();

        return getRootSide() === "start" ? fromStart : getLayerSpan() - fromStart - getLayerExtent();
    };

    const getCrossStart = (placement: BracketPlacement) => getHeaderExtent() + placement.cross * getCrossPitch();

    const getInset = (placement: BracketPlacement) =>
        getIsHorizontal()
            ? { left: getLayerStart(placement.layer), top: getCrossStart(placement) }
            : { left: getCrossStart(placement), top: getLayerStart(placement.layer) };

    const getHeaderBox = (layer: number) =>
        getIsHorizontal()
            ? { left: getLayerStart(layer), top: NOTHING, width: getLayerExtent(), height: getHeaderExtent() }
            : { left: NOTHING, top: getLayerStart(layer), width: getHeaderExtent(), height: getLayerExtent() };

    const getCrossCenter = (placement: BracketPlacement) => getCrossStart(placement) + getCrossExtent() * HALF;

    const getFacingEdge = (placement: BracketPlacement, isTowardRoot: boolean) =>
        BracketUtils.getFacingEdge(getLayerStart(placement.layer), getLayerExtent(), getRootSide(), isTowardRoot);

    const getPoint = (along: number, across: number) =>
        getIsHorizontal() ? { x: along, y: across } : { x: across, y: along };

    const getConnectors = createMemo((): BracketConnectorDefs[] =>
        getLayout()
            .placements.filter((placement) => placement.childIds.length > NOTHING)
            .flatMap((placement) => {
                const from = getPoint(getFacingEdge(placement, false), getCrossCenter(placement));

                return placement.childIds.flatMap((childId) => {
                    const child = BracketUtils.findPlacement(getLayout().placements, childId);

                    if (!child) return [];

                    return [
                        {
                            id: `${boardId}-${placement.id}-${childId}`,
                            parentId: placement.id,
                            childId,
                            orientation: getOrientation(),
                            from,
                            to: getPoint(getFacingEdge(child, true), getCrossCenter(child)),
                            isOnFocusedRoute: BracketUtils.getIsOnRoute(childId, getFocusedId()),
                        },
                    ];
                });
            }),
    );

    const getPlacementById = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.id, placement])),
    );

    const getNodeIds = createMemo(() => getLayout().placements.map((placement) => placement.id));

    const getLayers = createMemo(() => Array.from({ length: getLayout().layerCount }, (_unused, layer) => layer));

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getRovingId = createMemo(() => {
        const stops = getStops();
        const focused = getLastFocusedId();

        if (focused !== undefined && stops.some((placement) => placement.id === focused)) return focused;

        return stops[NOTHING]?.id;
    });

    const setNodeRef = (id: string, element: HTMLElement) => {
        setNodeRefs((previous) => ({ ...previous, [id]: element }));

        onCleanup(() => {
            setNodeRefs((previous) => ({ ...previous, [id]: undefined }));
        });
    };

    const getStepForKey = (key: string): BracketStep | undefined => {
        const alongLayers = getIsHorizontal() ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
        const towardRoot = getRootSide() === "start" ? alongLayers[NOTHING] : alongLayers[SINGLE];

        if (key === towardRoot) return "toRoot";
        if (alongLayers.includes(key)) return "toLeaves";
        if (key === "Home") return "first";
        if (key === "End") return "last";

        const acrossLayer = getIsHorizontal() ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];

        if (key === acrossLayer[NOTHING]) return "previous";
        if (key === acrossLayer[SINGLE]) return "next";
    };

    const activate = (id: string) => {
        props.onActivate?.(getNodeAt(id).value, getPlacementById().get(id) ?? MISSING_PLACEMENT);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingId();

        if (from === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(from);

            return;
        }

        const step = getStepForKey(e.key);

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, from, getStops());

        if (next === undefined) return;

        e.preventDefault();
        setLastFocusedId(next);
        getNodeRefs()[next]?.focus();
    };

    const renderItem = (id: string) => {
        const getPlacement = createMemo(() => getPlacementById().get(id) ?? MISSING_PLACEMENT);
        const getIsNodeDisabled = () => getPlacement().isDisabled;

        return (
            <li
                class={styles.bracketItem}
                style={{
                    left: `${getInset(getPlacement()).left}px`,
                    top: `${getInset(getPlacement()).top}px`,
                    width: `${getNodeSize().width}px`,
                    height: `${getNodeSize().height}px`,
                }}
            >
                <div
                    ref={(element) => setNodeRef(id, element)}
                    class={styles.bracketNode}
                    role="button"
                    tabindex={getIsNodeDisabled() ? undefined : id === getRovingId() ? 0 : -1}
                    aria-disabled={getIsNodeDisabled() || undefined}
                    onFocus={() => {
                        setLastFocusedId(id);
                        setHasFocus(true);
                    }}
                    onBlur={() => setHasFocus(false)}
                    onClick={() => {
                        if (getIsNodeDisabled()) return;

                        setLastFocusedId(id);
                        activate(id);
                    }}
                >
                    {props.renderNode(
                        () => getNodeAt(id),
                        () => ({
                            placement: getPlacement(),
                            isFocused: getFocusedId() === id,
                            isOnFocusedRoute: BracketUtils.getIsOnRoute(id, getFocusedId()),
                        }),
                    )}
                </div>
            </li>
        );
    };

    return (
        <div
            class={styles.bracketRoot}
            style={{ width: `${getBoardSize().width}px`, height: `${getBoardSize().height}px` }}
            role={props.renderLayerHeader ? "group" : undefined}
            aria-label={props.renderLayerHeader ? access(props.ariaLabel) : undefined}
            onKeyDown={handleKeyDown}
        >
            <svg
                class={styles.bracketConnectors}
                viewBox={`0 0 ${getBoardSize().width} ${getBoardSize().height}`}
                aria-hidden="true"
            >
                <Index each={getConnectors()}>{(getDefs) => <>{props.renderConnector?.(getDefs)}</>}</Index>
            </svg>

            <Show
                when={props.renderLayerHeader}
                fallback={
                    <ul class={styles.bracketList} aria-label={access(props.ariaLabel)}>
                        <For each={getNodeIds()}>{renderItem}</For>
                    </ul>
                }
            >
                {(getRenderLayerHeader) => (
                    <For each={getLayers()}>
                        {(layer) => {
                            const headerId = `${boardId}-layer-${layer}`;
                            const getLayerNodeIds = createMemo(() =>
                                getLayout()
                                    .placements.filter((placement) => placement.layer === layer)
                                    .map((placement) => placement.id),
                            );

                            return (
                                <>
                                    <div
                                        id={headerId}
                                        class={styles.bracketLayerHeader}
                                        style={{
                                            left: `${getHeaderBox(layer).left}px`,
                                            top: `${getHeaderBox(layer).top}px`,
                                            width: `${getHeaderBox(layer).width}px`,
                                            height: `${getHeaderBox(layer).height}px`,
                                        }}
                                    >
                                        {getRenderLayerHeader()(layer)}
                                    </div>

                                    <ul class={styles.bracketList} aria-labelledby={headerId}>
                                        <For each={getLayerNodeIds()}>{renderItem}</For>
                                    </ul>
                                </>
                            );
                        }}
                    </For>
                )}
            </Show>
        </div>
    );
};
