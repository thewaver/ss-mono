import {
    For,
    Index,
    Show,
    createComputed,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    untrack,
} from "solid-js";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketArrangement,
    type BracketPlacement,
    BracketUtils,
    NavigatorUtils,
    TreemapUtils,
    BracketStyles as styles,
} from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { BracketProps } from "./BracketSolid.types";

const NOTHING = 0;

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = createUniqueId();

    const [getNodeRefs, setNodeRefs] = createSignal<Record<string, HTMLElement | undefined>>({});
    const [getLastFocusedId, setLastFocusedId] = createSignal<string>();
    const [getHasFocus, setHasFocus] = createSignal(false);
    const [getGlideFrom, setGlideFrom] = createSignal<BracketArrangement>();

    const glideClock = TreemapUtils.createZoomClock();

    let isStepping = false;

    onCleanup(glideClock.stop);

    const getProgress = accessStore(glideClock);

    const getRootNode = createMemo(() => access(props.root));

    const getLayout = createMemo(() => BracketUtils.computeLayout(getRootNode()));

    const getIsFamilyView = createMemo(() => (access(props.view) ?? BRACKET_DEFAULTS.view) === "family");

    const getExtent = createMemo(() =>
        getIsFamilyView() ? BracketUtils.computeFamilyExtent(getLayout()) : getLayout(),
    );

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? BRACKET_DEFAULTS.transitionDurationMs,
    );

    const getNodeSize = createMemo(() => access(props.nodeSize));

    const getOrientation = createMemo(() => access(props.orientation) ?? BRACKET_DEFAULTS.orientation);

    const getRootSide = createMemo(() => access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide);

    const getGeometry = createMemo(() =>
        BracketUtils.computeGeometry(getExtent(), {
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

    const getAnchorId = createMemo(() => BracketUtils.getFamilyAnchorId(getFocusedId()));

    const computeArrangement = (anchorId: string | undefined) =>
        BracketUtils.computeFamilyArrangement(getLayout(), getGeometry(), getExtent(), anchorId);

    const getTarget = createMemo(() => (getIsFamilyView() ? computeArrangement(getAnchorId()) : undefined));

    const getShown = createMemo(() => {
        const target = getTarget();

        return target && BracketUtils.computeShownArrangement(getGlideFrom(), target, getProgress());
    });

    createComputed(
        on(
            getAnchorId,
            (_next, previous) => {
                if (!untrack(getIsFamilyView)) return;

                setGlideFrom(
                    untrack(() =>
                        BracketUtils.computeShownArrangement(
                            getGlideFrom(),
                            computeArrangement(previous),
                            getProgress(),
                        ),
                    ),
                );
                glideClock.start(untrack(getTransitionDurationMs));
            },
            { defer: true },
        ),
    );

    const getBoardSize = createMemo(() => getGeometry().boardSize);

    const getInset = (placement: BracketPlacement) =>
        getShown()?.nodes[placement.id] ?? BracketUtils.computeInset(getGeometry(), placement);

    const getHeaderBox = (layer: number) => {
        const box = BracketUtils.computeHeaderBox(getGeometry(), layer);
        const frame = getShown()?.headers[layer];

        return frame ? { ...box, left: frame.left, top: frame.top } : box;
    };

    const getConnectors = createMemo(() =>
        BracketUtils.computeConnectors(getLayout(), getGeometry(), boardId, getFocusedId(), getShown()?.nodes),
    );

    const getPlacementById = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.id, placement])),
    );

    createEffect(() => {
        if (!getIsFamilyView()) return;

        const anchorId = getAnchorId();

        untrack(() =>
            props.onFamilyChange?.(
                anchorId === undefined ? undefined : BracketUtils.findNode(getRootNode(), anchorId).value,
                anchorId === undefined ? undefined : getPlacementById().get(anchorId),
            ),
        );
    });

    const getNodeIds = createMemo(() => getLayout().placements.map((placement) => placement.id));

    const getLayers = createMemo(() => Array.from({ length: getLayout().layerCount }, (_unused, layer) => layer));

    const getStops = createMemo(() => getLayout().placements.filter((placement) => !placement.isDisabled));

    const getUnfoldedStops = createMemo(() =>
        getStops().filter((placement) => !getTarget()?.nodes[placement.id]?.isFolded),
    );

    const getRovingId = createMemo(() => BracketUtils.resolveRovingId(getUnfoldedStops(), getLastFocusedId()));

    const getIsNode = (target: EventTarget | null) =>
        Object.values(getNodeRefs()).some((element) => element !== undefined && element === target);

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
        isStepping = true;
        setLastFocusedId(next);
        getNodeRefs()[next]?.focus();
        isStepping = false;
    };

    const renderItem = (id: string) => {
        const getPlacement = createMemo(() => getPlacementById().get(id) ?? BRACKET_MISSING_PLACEMENT);
        const getIsNodeDisabled = () => getPlacement().isDisabled;
        const getFrame = () => getShown()?.nodes[id];
        const getIsFolded = () => getTarget()?.nodes[id]?.isFolded ?? false;

        return (
            <li
                class={styles.bracketItem}
                style={{
                    left: `${getInset(getPlacement()).left}px`,
                    top: `${getInset(getPlacement()).top}px`,
                    width: `${getNodeSize().width}px`,
                    height: `${getNodeSize().height}px`,
                    opacity: getFrame() === undefined ? undefined : `${getFrame()!.opacity}`,
                    visibility: BracketUtils.getIsFrameHidden(getFrame()) ? "hidden" : undefined,
                }}
                aria-hidden={getIsFolded() ? "true" : undefined}
                inert={getIsFolded() || undefined}
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
                    onBlur={(e) => {
                        if (isStepping || getIsNode(e.relatedTarget)) return;

                        setHasFocus(false);
                    }}
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
                <Index each={getConnectors()}>
                    {(getDefs) => (
                        <Show when={getShown()} fallback={<>{props.renderConnector?.(getDefs)}</>}>
                            {(getArrangement) => (
                                <g
                                    style={{
                                        opacity: `${BracketUtils.computeConnectorOpacity(getArrangement().nodes, getDefs())}`,
                                    }}
                                >
                                    {props.renderConnector?.(getDefs)}
                                </g>
                            )}
                        </Show>
                    )}
                </Index>
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

                            const getFrame = () => getShown()?.headers[layer];
                            const getIsFolded = () => getTarget()?.headers[layer]?.isFolded ?? false;

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
                                            opacity: getFrame() === undefined ? undefined : `${getFrame()!.opacity}`,
                                            visibility: BracketUtils.getIsFrameHidden(getFrame())
                                                ? "hidden"
                                                : undefined,
                                        }}
                                        aria-hidden={getIsFolded() ? "true" : undefined}
                                    >
                                        {getRenderLayerHeader()(layer)}
                                    </div>

                                    <ul
                                        class={styles.bracketList}
                                        aria-labelledby={headerId}
                                        aria-hidden={getIsFolded() ? "true" : undefined}
                                    >
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
