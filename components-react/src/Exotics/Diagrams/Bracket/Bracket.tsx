import { Fragment, type KeyboardEvent, type ReactNode, useId, useMemo, useRef, useState } from "react";

import {
    BRACKET_DEFAULTS,
    BRACKET_MISSING_PLACEMENT,
    BracketStyles,
    BracketUtils,
    NavigatorUtils,
} from "@thewaver/ss-components";

import type { BracketProps } from "./Bracket.types";

const NOTHING = 0;

export const Bracket = <T,>(props: BracketProps<T>) => {
    const boardId = useId();
    const nodeRefs = useRef(new Map<string, HTMLElement>());

    const [lastFocusedId, setLastFocusedId] = useState<string>();
    const [hasFocus, setHasFocus] = useState(false);

    const orientation = props.orientation ?? BRACKET_DEFAULTS.orientation;
    const rootSide = props.rootSide ?? BRACKET_DEFAULTS.rootSide;

    const layout = useMemo(() => BracketUtils.computeLayout(props.root), [props.root]);

    const geometry = BracketUtils.computeGeometry(layout, {
        nodeSize: props.nodeSize,
        layerGap: props.layerGap ?? BRACKET_DEFAULTS.layerGap,
        crossGap: props.crossGap ?? BRACKET_DEFAULTS.crossGap,
        orientation,
        rootSide,
        headerExtent: props.renderLayerHeader ? (props.layerHeaderSize ?? BRACKET_DEFAULTS.layerHeaderSize) : NOTHING,
    });

    const focusedId = hasFocus ? lastFocusedId : undefined;
    const boardSize = geometry.boardSize;
    const connectors = BracketUtils.computeConnectors(layout, geometry, boardId, focusedId);

    const placementById = useMemo(
        () => new Map(layout.placements.map((placement) => [placement.id, placement])),
        [layout],
    );

    const stops = layout.placements.filter((placement) => !placement.isDisabled);
    const rovingId = BracketUtils.resolveRovingId(stops, lastFocusedId);

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
        setLastFocusedId(next);
        nodeRefs.current.get(next)?.focus();
    };

    const renderItem = (id: string): ReactNode => {
        const placement = placementById.get(id) ?? BRACKET_MISSING_PLACEMENT;
        const isNodeDisabled = placement.isDisabled;
        const inset = BracketUtils.computeInset(geometry, placement);

        return (
            <li
                key={id}
                className={BracketStyles.bracketItem}
                style={{
                    left: `${inset.left}px`,
                    top: `${inset.top}px`,
                    width: `${props.nodeSize.width}px`,
                    height: `${props.nodeSize.height}px`,
                }}
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

                        setLastFocusedId(id);
                        setHasFocus(true);
                    }}
                    onBlur={(e) => {
                        if (e.target !== e.currentTarget) return;

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
                    <Fragment key={index}>{props.renderConnector?.(defs)}</Fragment>
                ))}
            </svg>

            {renderLayerHeader ? (
                Array.from({ length: layout.layerCount }, (_unused, layer) => {
                    const headerId = `${boardId}-layer-${layer}`;
                    const headerBox = BracketUtils.computeHeaderBox(geometry, layer);

                    return (
                        <Fragment key={layer}>
                            <div
                                id={headerId}
                                className={BracketStyles.bracketLayerHeader}
                                style={{
                                    left: `${headerBox.left}px`,
                                    top: `${headerBox.top}px`,
                                    width: `${headerBox.width}px`,
                                    height: `${headerBox.height}px`,
                                }}
                            >
                                {renderLayerHeader(layer)}
                            </div>

                            <ul className={BracketStyles.bracketList} aria-labelledby={headerId}>
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
