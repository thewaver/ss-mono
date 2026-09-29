import { For, Index, Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketPlacement,
    BracketUtils,
    NavigatorUtils,
    BracketStyles as styles,
} from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { BracketProps } from "./BracketSolid.types";

const NOTHING = 0;

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = createUniqueId();

    const [getNodeRefs, setNodeRefs] = createSignal<Record<string, HTMLElement | undefined>>({});
    const [getLastFocusedId, setLastFocusedId] = createSignal<string>();
    const [getHasFocus, setHasFocus] = createSignal(false);

    const getRootNode = createMemo(() => access(props.root));

    const getLayout = createMemo(() => BracketUtils.computeLayout(getRootNode()));

    const getNodeSize = createMemo(() => access(props.nodeSize));

    const getOrientation = createMemo(() => access(props.orientation) ?? BRACKET_DEFAULTS.orientation);

    const getRootSide = createMemo(() => access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide);

    const getGeometry = createMemo(() =>
        BracketUtils.computeGeometry(getLayout(), {
            nodeSize: getNodeSize(),
            layerGap: access(props.layerGap) ?? BRACKET_DEFAULTS.layerGap,
            crossGap: access(props.crossGap) ?? BRACKET_DEFAULTS.crossGap,
            orientation: getOrientation(),
            rootSide: getRootSide(),
            headerExtent: props.renderLayerHeader
                ? (access(props.layerHeaderSize) ?? BRACKET_DEFAULTS.layerHeaderSize)
                : NOTHING,
        }),
    );

    const getFocusedId = createMemo(() => (getHasFocus() ? getLastFocusedId() : undefined));

    const getBoardSize = createMemo(() => getGeometry().boardSize);

    const getInset = (placement: BracketPlacement) => BracketUtils.computeInset(getGeometry(), placement);

    const getHeaderBox = (layer: number) => BracketUtils.computeHeaderBox(getGeometry(), layer);

    const getConnectors = createMemo(() =>
        BracketUtils.computeConnectors(getLayout(), getGeometry(), boardId, getFocusedId()),
    );

    const getPlacementById = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.id, placement])),
    );

    const getNodeIds = createMemo(() => getLayout().placements.map((placement) => placement.id));

    const getLayers = createMemo(() => Array.from({ length: getLayout().layerCount }, (_unused, layer) => layer));

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getRovingId = createMemo(() => BracketUtils.resolveRovingId(getStops(), getLastFocusedId()));

    const setNodeRef = (id: string, element: HTMLElement) => {
        setNodeRefs((previous) => ({ ...previous, [id]: element }));

        onCleanup(() => {
            setNodeRefs((previous) => ({ ...previous, [id]: undefined }));
        });
    };

    const activate = (id: string) => {
        props.onActivate?.(
            BracketUtils.findNode(getRootNode(), id).value,
            getPlacementById().get(id) ?? BRACKET_MISSING_PLACEMENT,
        );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingId();

        if (from === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(from);

            return;
        }

        const step = BracketUtils.getKeyStep(e.key, getOrientation(), getRootSide());

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, from, getStops());

        if (next === undefined) return;

        e.preventDefault();
        setLastFocusedId(next);
        getNodeRefs()[next]?.focus();
    };

    const renderItem = (id: string) => {
        const getPlacement = createMemo(() => getPlacementById().get(id) ?? BRACKET_MISSING_PLACEMENT);
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
                        () => BracketUtils.findNode(getRootNode(), id),
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
