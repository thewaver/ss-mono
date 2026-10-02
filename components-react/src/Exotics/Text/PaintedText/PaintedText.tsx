import { type CSSProperties, Fragment, useEffect, useId, useLayoutEffect, useReducer, useRef, useState } from "react";

import {
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextRun,
    PaintedTextStyles,
    PaintedTextUtils,
    ShapeLayerUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { useElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;

const toReactStyle = (style: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

const renderDefsElements = (defs: SVGDefs[]) =>
    defs.map((def, index) => (
        <Fragment key={index}>
            {def.gradientOrPattern?.renderDefsElement()}
            {def.filter?.renderDefsElement()}
            {def.clipPath?.renderDefsElement()}
        </Fragment>
    ));

const renderRun = (run: PaintedTextRun, index: number, isReadable: boolean) => (
    <tspan key={index} x={run.x} y={run.y} style={toReactStyle(run.style)}>
        {isReadable && run.title && <title>{run.title}</title>}
        {isReadable && run.anchor ? (
            <a href={run.anchor.href} target={run.anchor.target} rel={run.anchor.rel}>
                {run.text}
            </a>
        ) : (
            run.text
        )}
    </tspan>
);

export const PaintedText = (props: PaintedTextProps) => {
    const maskId = `painted-text-mask-${useId()}`;

    const rootRef = useRef<HTMLDivElement>(null);
    const rootElement = useElement(rootRef);
    const sourceRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);

    const [layout] = useState(() =>
        PaintedTextUtils.createLayout({
            getSource: () => sourceRef.current ?? undefined,
            getLayoutHost: () => layoutRef.current ?? undefined,
        }),
    );

    const runs = useStore(layout, (state) => state.runs);
    const atomics = useStore(layout, (state) => state.atomics);
    const width = useStore(layout, (state) => state.width ?? 0);
    const height = useStore(layout, (state) => state.height);

    const isUpdatePendingRef = useRef(false);
    const [, requestMeasure] = useReducer((count: number) => count + 1, 0);

    useLayoutEffect(() => {
        if (!isUpdatePendingRef.current) return;

        isUpdatePendingRef.current = false;
        layout.update();
    });

    const [controller] = useState<PaintedTextController>(() => ({
        update: () => {
            if (!sourceRef.current) return false;

            isUpdatePendingRef.current = true;
            requestMeasure();

            return true;
        },
    }));

    useLayoutEffect(() => {
        const source = sourceRef.current;

        return source ? layout.observe(source) : undefined;
    }, [layout]);

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const size = { width, height };
    const strokePaint = PaintedTextUtils.computeStrokePaint(
        props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
        props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
    );
    const strokeDefs = props.computeStrokeDefs?.(size, rootElement) ?? [];
    const fillDefs = PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, rootElement), strokeDefs);
    const maskPadding = strokePaint.drawnWidth;

    const renderRuns = (isReadable: boolean) => runs.map((run, index) => renderRun(run, index, isReadable));

    return (
        <div ref={rootRef} className={PaintedTextStyles.paintedTextRoot}>
            <div ref={sourceRef} className={PaintedTextStyles.paintedTextSourceWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            <div ref={layoutRef} className={PaintedTextStyles.paintedTextLayoutWrap} aria-hidden="true" inert />

            <svg
                className={PaintedTextStyles.paintedTextSVG}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
            >
                <defs>
                    {renderDefsElements(fillDefs)}
                    {renderDefsElements(strokeDefs)}

                    {strokePaint.maskKind && (
                        <mask
                            id={maskId}
                            maskUnits="userSpaceOnUse"
                            x={-maskPadding}
                            y={-maskPadding}
                            width={width + maskPadding * MASK_PADDING_SIDES}
                            height={height + maskPadding * MASK_PADDING_SIDES}
                        >
                            {strokePaint.maskKind === "outside" && (
                                <rect
                                    x={-maskPadding}
                                    y={-maskPadding}
                                    width={width + maskPadding * MASK_PADDING_SIDES}
                                    height={height + maskPadding * MASK_PADDING_SIDES}
                                    fill="white"
                                />
                            )}

                            <text
                                className={PaintedTextStyles.paintedTextLayer}
                                fill={strokePaint.maskKind === "outside" ? "black" : "white"}
                            >
                                {renderRuns(false)}
                            </text>
                        </mask>
                    )}
                </defs>

                {fillDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);
                    const isReadable = PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length);

                    return (
                        <text
                            key={index}
                            className={PaintedTextStyles.paintedTextLayer}
                            fill={paint.fill}
                            fillOpacity={paint.fillOpacity}
                            filter={paint.filter}
                            clipPath={paint.clipPath}
                            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
                            aria-hidden={isReadable ? undefined : "true"}
                        >
                            {renderRuns(isReadable)}
                        </text>
                    );
                })}

                {strokeDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);
                    const isReadable = PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length);

                    return (
                        <text
                            key={index}
                            className={PaintedTextStyles.paintedTextLayer}
                            fill="none"
                            stroke={paint.fill}
                            strokeOpacity={paint.fillOpacity}
                            strokeWidth={strokePaint.drawnWidth}
                            strokeLinejoin="round"
                            mask={strokePaint.maskKind ? `url(#${maskId})` : undefined}
                            filter={paint.filter}
                            clipPath={paint.clipPath}
                            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
                            aria-hidden={isReadable ? undefined : "true"}
                        >
                            {renderRuns(isReadable)}
                        </text>
                    );
                })}

                {atomics.map((node, index) => (
                    <g
                        key={index}
                        ref={(group) => {
                            if (group && group.firstChild !== node) group.replaceChildren(node);
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};
