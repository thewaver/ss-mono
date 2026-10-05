import {
    Fragment,
    type KeyboardEvent,
    type ReactNode,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { flushSync } from "react-dom";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    type BracketArrangement,
    type BracketNode,
    BracketStyles,
    BracketUtils,
    NavigatorUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useStore } from "../../../Utils/storeUtils";
import type { BracketProps } from "./Bracket.types";

const NOTHING = 0;
const NEXT = 1;

type BracketGlide = {
    anchorId: string | undefined;
    isFamilyView: boolean;
    from: BracketArrangement | undefined;
    generation: number;
};

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = useId();
    const nodeRefs = useRef(new Map<string, HTMLElement>());
    const isStepping = useRef(false);

    const [lastFocusedId, setLastFocusedId] = useState<string>();
    const [hasFocus, setHasFocus] = useState(false);
    const [glideClock] = useState(TreemapUtils.createZoomClock);

    const progress = useStore(glideClock);

    const orientation = props.orientation ?? BRACKET_DEFAULTS.orientation;
    const rootSide = props.rootSide ?? BRACKET_DEFAULTS.rootSide;
    const isFamilyView = (props.view ?? BRACKET_DEFAULTS.view) === "family";
    const transitionDurationMs = props.transitionDurationMs ?? BRACKET_DEFAULTS.transitionDurationMs;

    const layout = useMemo(() => BracketUtils.computeLayout(props.root), [props.root]);

    const extent = useMemo(
        () => (isFamilyView ? BracketUtils.computeFamilyExtent(layout) : layout),
        [isFamilyView, layout],
    );

    const geometry = BracketUtils.computeGeometry(extent, {
        nodeSize: props.nodeSize,
        layerGap: props.layerGap ?? BRACKET_DEFAULTS.layerGap,
        crossGap: props.crossGap ?? BRACKET_DEFAULTS.crossGap,
        orientation,
        rootSide,
        headerExtent: props.renderLayerHeader ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize) : NOTHING,
    });

    const focusedId = hasFocus ? lastFocusedId : undefined;

    const [family, setFamily] = SignalMirrorReactUtils.useOptionalState<BracketNode<T> | undefined>(
        props.family,
        undefined,
    );

    const anchorId = useMemo(() => BracketUtils.findNodeId(props.root, layout, family), [props.root, layout, family]);

    const currentLayer = BracketUtils.getFamilyLayer(layout, anchorId);

    const lastShown = useRef<BracketArrangement>(undefined);

    const [glide, setGlide] = useState<BracketGlide>(() => ({
        anchorId,
        isFamilyView,
        from: undefined,
        generation: NOTHING,
    }));

    if (glide.anchorId !== anchorId || glide.isFamilyView !== isFamilyView) {
        const isGliding = isFamilyView || glide.isFamilyView !== isFamilyView;

        setGlide({
            anchorId,
            isFamilyView,
            from: isGliding ? lastShown.current : glide.from,
            generation: isGliding ? glide.generation + NEXT : glide.generation,
        });
    }

    const target = isFamilyView
        ? BracketUtils.computeFamilyArrangement(layout, geometry, extent, anchorId)
        : BracketUtils.computeTreeArrangement(layout, geometry);
    const shown = BracketUtils.computeShownArrangement(glide.from, target, progress);

    useLayoutEffect(() => {
        lastShown.current = shown;
    });

    const boardSize = shown.boardSize;
    const connectors = BracketUtils.computeConnectors(layout, geometry, boardId, focusedId, shown.nodes);

    const placementById = useMemo(
        () => new Map(layout.placements.map((placement) => [placement.id, placement])),
        [layout],
    );

    const stops = layout.placements.filter((placement) => !placement.isDisabled);
    const unfoldedStops = stops.filter((placement) => !target.nodes[placement.id]?.isFolded);
    const rovingId = BracketUtils.resolveRovingId(unfoldedStops, lastFocusedId);

    const getIsNode = (eventTarget: EventTarget | null) =>
        [...nodeRefs.current.values()].some((element) => element === eventTarget);

    useEffect(() => glideClock.stop, [glideClock]);

    useLayoutEffect(() => {
        if (glide.generation === NOTHING) return;

        glideClock.start(transitionDurationMs);
    }, [glide.generation]);

    const showFamilyOf = (id: string) => {
        const familyAnchorId = BracketUtils.getFamilyAnchorId(id);

        setFamily(familyAnchorId === undefined ? undefined : BracketUtils.findNode(props.root, familyAnchorId));
    };

    const activate = (id: string) => {
        props.onActivate?.(
            BracketUtils.findNode(props.root, id).value,
            placementById.get(id) ?? BRACKET_MISSING_PLACEMENT,
        );
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (rovingId === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(rovingId);

            return;
        }

        const step = BracketUtils.getKeyStep(e.key, orientation, rootSide);

        if (step === undefined) return;

        const next = BracketUtils.computeStepId(step, rovingId, stops);

        if (next === undefined) return;

        e.preventDefault();
        isStepping.current = true;
        flushSync(() => {
            showFamilyOf(next);
            setLastFocusedId(next);
        });
        nodeRefs.current.get(next)?.focus();
        isStepping.current = false;
    };

    const renderItem = (id: string): ReactNode => {
        const placement = placementById.get(id) ?? BRACKET_MISSING_PLACEMENT;
        const isNodeDisabled = placement.isDisabled;
        const frame = shown.nodes[id];
        const inset = frame ?? BracketUtils.computeInset(geometry, placement);
        const isFolded = target.nodes[id]?.isFolded ?? false;

        return (
            <li
                key={id}
                className={BracketStyles.bracketItem}
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
                    ref={(element) => {
                        if (element) nodeRefs.current.set(id, element);
                        else nodeRefs.current.delete(id);
                    }}
                    className={BracketStyles.bracketNode}
                    role="button"
                    tabIndex={isNodeDisabled ? undefined : id === rovingId ? 0 : -1}
                    aria-disabled={isNodeDisabled || undefined}
                    onFocus={(e) => {
                        if (e.target !== e.currentTarget) return;

                        showFamilyOf(id);
                        setLastFocusedId(id);
                        setHasFocus(true);
                    }}
                    onBlur={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (isStepping.current || getIsNode(e.relatedTarget)) return;

                        setHasFocus(false);
                    }}
                    onClick={() => {
                        if (isNodeDisabled) return;

                        setLastFocusedId(id);
                        activate(id);
                    }}
                >
                    {props.renderNode(BracketUtils.findNode(props.root, id), {
                        placement,
                        isFocused: focusedId === id,
                        isOnFocusedRoute: BracketUtils.getIsOnRoute(id, focusedId),
                    })}
                </div>
            </li>
        );
    };

    const renderLayerHeader = props.renderLayerHeader;

    return (
        <div
            className={BracketStyles.bracketRoot}
            style={{ width: `${boardSize.width}px`, height: `${boardSize.height}px` }}
            role={renderLayerHeader ? "group" : undefined}
            aria-label={renderLayerHeader ? props.ariaLabel : undefined}
            onKeyDown={handleKeyDown}
        >
            <svg
                className={BracketStyles.bracketConnectors}
                viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
                aria-hidden="true"
            >
                {connectors.map((defs, index) => (
                    <g key={index} style={{ opacity: BracketUtils.computeConnectorOpacity(shown.nodes, defs) }}>
                        {props.renderConnector?.(defs)}
                    </g>
                ))}
            </svg>

            {renderLayerHeader ? (
                Array.from({ length: layout.layerCount }, (_unused, layer) => {
                    const headerId = `${boardId}-layer-${layer}`;
                    const headerBox = BracketUtils.computeHeaderBox(geometry, layer);
                    const headerFrame = shown.headers[layer];
                    const isHeaderFolded = target.headers[layer]?.isFolded ?? false;

                    return (
                        <Fragment key={layer}>
                            <div
                                id={headerId}
                                className={BracketStyles.bracketLayerHeader}
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
                                {renderLayerHeader(layer, { isCurrent: currentLayer === layer })}
                            </div>

                            <ul
                                className={BracketStyles.bracketList}
                                aria-labelledby={headerId}
                                aria-hidden={isHeaderFolded ? "true" : undefined}
                            >
                                {layout.placements
                                    .filter((placement) => placement.layer === layer)
                                    .map((placement) => renderItem(placement.id))}
                            </ul>
                        </Fragment>
                    );
                })
            ) : (
                <ul className={BracketStyles.bracketList} aria-label={props.ariaLabel}>
                    {layout.placements.map((placement) => renderItem(placement.id))}
                </ul>
            )}
        </div>
    );
};
