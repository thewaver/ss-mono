import { For, Index, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { access } from "../../Utils/propUtils";
import type {
    BracketConnectorDefs,
    BracketNode,
    BracketOrientation,
    BracketPlacement,
    BracketProps,
    BracketRootSide,
    BracketStep,
} from "./Bracket.types";
import { BracketUtils } from "./Bracket.utils";

import * as styles from "./Bracket.css";

const DEFAULT_LAYER_GAP = 40;
const DEFAULT_CROSS_GAP = 12;
const DEFAULT_ORIENTATION: BracketOrientation = "horizontal";
const DEFAULT_ROOT_SIDE: BracketRootSide = "end";
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
    const [getFocusedId, setFocusedId] = createSignal<string>();

    const getRootNode = createMemo(() => access(props.root));

    const getLayout = createMemo(() => BracketUtils.computeLayout(getRootNode()));

    const getNodeSize = createMemo(() => access(props.nodeSize));

    const getLayerGap = createMemo(() => access(props.layerGap) ?? DEFAULT_LAYER_GAP);

    const getCrossGap = createMemo(() => access(props.crossGap) ?? DEFAULT_CROSS_GAP);

    const getOrientation = createMemo(() => access(props.orientation) ?? DEFAULT_ORIENTATION);

    const getRootSide = createMemo(() => access(props.rootSide) ?? DEFAULT_ROOT_SIDE);

    const getIsHorizontal = createMemo(() => getOrientation() === "horizontal");

    const getLayerExtent = createMemo(() => (getIsHorizontal() ? getNodeSize().width : getNodeSize().height));

    const getCrossExtent = createMemo(() => (getIsHorizontal() ? getNodeSize().height : getNodeSize().width));

    const getLayerPitch = createMemo(() => getLayerExtent() + getLayerGap());

    const getCrossPitch = createMemo(() => getCrossExtent() + getCrossGap());

    const getLayerSpan = createMemo(() => getLayout().layerCount * getLayerPitch() - getLayerGap());

    const getCrossSpan = createMemo(() => getLayout().leafCount * getCrossPitch() - getCrossGap());

    const getBoardSize = createMemo(() =>
        getIsHorizontal()
            ? { width: getLayerSpan(), height: getCrossSpan() }
            : { width: getCrossSpan(), height: getLayerSpan() },
    );

    const getNodeAt = (id: string): BracketNode<T> => {
        const path = id.split(".").slice(SINGLE).map(Number);

        return path.reduce<BracketNode<T>>((node, index) => node.children![index], getRootNode());
    };

    const getLayerStart = (placement: BracketPlacement) => {
        const fromStart = placement.layer * getLayerPitch();

        return getRootSide() === "start" ? fromStart : getLayerSpan() - fromStart - getLayerExtent();
    };

    const getCrossStart = (placement: BracketPlacement) => placement.cross * getCrossPitch();

    const getInset = (placement: BracketPlacement) =>
        getIsHorizontal()
            ? { left: getLayerStart(placement), top: getCrossStart(placement) }
            : { left: getCrossStart(placement), top: getLayerStart(placement) };

    const getCrossCenter = (placement: BracketPlacement) => getCrossStart(placement) + getCrossExtent() * HALF;

    const getFacingEdge = (placement: BracketPlacement, isTowardRoot: boolean) =>
        BracketUtils.getFacingEdge(getLayerStart(placement), getLayerExtent(), getRootSide(), isTowardRoot);

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
                        },
                    ];
                });
            }),
    );

    const getPlacementById = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.id, placement])),
    );

    const getNodeIds = createMemo(() => getLayout().placements.map((placement) => placement.id));

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getRovingId = createMemo(() => {
        const stops = getStops();
        const focused = getFocusedId();

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

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingId();

        if (from === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            props.onActivate?.(getNodeAt(from).value);

            return;
        }

        const step = getStepForKey(e.key);

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, from, getStops());

        if (next === undefined) return;

        e.preventDefault();
        setFocusedId(next);
        getNodeRefs()[next]?.focus();
    };

    return (
        <div
            class={styles.bracketRoot}
            style={{ width: `${getBoardSize().width}px`, height: `${getBoardSize().height}px` }}
            onKeyDown={handleKeyDown}
        >
            <svg
                class={styles.bracketConnectors}
                viewBox={`0 0 ${getBoardSize().width} ${getBoardSize().height}`}
                aria-hidden="true"
            >
                <Index each={getConnectors()}>{(getDefs) => <>{props.renderConnector?.(getDefs)}</>}</Index>
            </svg>

            <ul class={styles.bracketList} aria-label={access(props.ariaLabel)}>
                <For each={getNodeIds()}>
                    {(id) => {
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
                                    onClick={() => {
                                        if (getIsNodeDisabled()) return;

                                        setFocusedId(id);
                                        props.onActivate?.(getNodeAt(id).value);
                                    }}
                                >
                                    {props.renderNode(
                                        () => getNodeAt(id),
                                        () => ({ placement: getPlacement(), isFocused: getFocusedId() === id }),
                                    )}
                                </div>
                            </li>
                        );
                    }}
                </For>
            </ul>
        </div>
    );
};
