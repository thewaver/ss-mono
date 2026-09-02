import { For, Index, createMemo, createSignal, createUniqueId } from "solid-js";

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

const ACTIVATION_KEYS = ["Enter", " "];

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

    const getCrossCentre = (placement: BracketPlacement) => getCrossStart(placement) + getCrossExtent() * HALF;

    const getFacingEdge = (placement: BracketPlacement, isTowardRoot: boolean) =>
        BracketUtils.getFacingEdge(getLayerStart(placement), getLayerExtent(), getRootSide(), isTowardRoot);

    const getPoint = (along: number, across: number) =>
        getIsHorizontal() ? { x: along, y: across } : { x: across, y: along };

    const getConnectors = createMemo((): BracketConnectorDefs[] =>
        getLayout()
            .placements.filter((placement) => placement.childIds.length > NOTHING)
            .flatMap((placement) => {
                const from = getPoint(getFacingEdge(placement, false), getCrossCentre(placement));

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
                            to: getPoint(getFacingEdge(child, true), getCrossCentre(child)),
                        },
                    ];
                });
            }),
    );

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getRovingId = createMemo(() => {
        const stops = getStops();
        const focused = getFocusedId();

        if (focused !== undefined && stops.some((placement) => placement.id === focused)) return focused;

        return stops[NOTHING]?.id;
    });

    const setNodeRef = (id: string, element: HTMLElement) => {
        setNodeRefs((previous) => ({ ...previous, [id]: element }));
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

        if (ACTIVATION_KEYS.includes(e.key)) {
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
                <For each={getLayout().placements}>
                    {(placement) => (
                        <li
                            class={styles.bracketItem}
                            style={{
                                left: `${getInset(placement).left}px`,
                                top: `${getInset(placement).top}px`,
                                width: `${getNodeSize().width}px`,
                                height: `${getNodeSize().height}px`,
                            }}
                        >
                            <div
                                ref={(element) => setNodeRef(placement.id, element)}
                                class={styles.bracketNode}
                                role="button"
                                tabindex={placement.isDisabled || placement.id !== getRovingId() ? undefined : 0}
                                aria-disabled={placement.isDisabled || undefined}
                                onClick={() => {
                                    if (placement.isDisabled) return;

                                    setFocusedId(placement.id);
                                    props.onActivate?.(getNodeAt(placement.id).value);
                                }}
                            >
                                {props.renderNode(
                                    () => getNodeAt(placement.id),
                                    () => ({ placement, isFocused: getFocusedId() === placement.id }),
                                )}
                            </div>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};
