import { type CSSProperties, Fragment, type SlotsType, defineComponent, nextTick, shallowRef, useId } from "vue";

import {
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextRun,
    PaintedTextStyles,
    PaintedTextUtils,
    ShapeLayerUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { PaintedTextController, PaintedTextProps, PaintedTextSlots } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;

const toVueStyle = (style: Record<string, unknown>) =>
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
    <tspan key={index} x={run.x} y={run.y} style={toVueStyle(run.style)}>
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

export const PaintedText = defineComponent(
    (props: PaintedTextProps, { slots }: SlotsContext<PaintedTextSlots>) => {
        const maskId = `painted-text-mask-${useId()}`;

        const rootRef = shallowRef<HTMLDivElement>();
        const sourceRef = shallowRef<HTMLDivElement>();
        const layoutRef = shallowRef<HTMLDivElement>();

        const layout = PaintedTextUtils.createLayout({
            getSource: () => sourceRef.value,
            getLayoutHost: () => layoutRef.value,
        });

        const state = useStore(layout);

        const controller: PaintedTextController = {
            update: () => {
                if (!sourceRef.value) return false;

                void nextTick(() => layout.update());

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);

            const source = sourceRef.value;

            return source ? layout.observe(source) : undefined;
        });

        return () => {
            const { runs, atomics, height } = state.value;
            const width = state.value.width ?? 0;
            const size = { width, height };
            const strokePaint = PaintedTextUtils.computeStrokePaint(
                props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
                props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
            );
            const strokeDefs = props.computeStrokeDefs?.(size, rootRef.value) ?? [];
            const fillDefs = PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, rootRef.value), strokeDefs);
            const maskPadding = strokePaint.drawnWidth;

            const renderRuns = (isReadable: boolean) => runs.map((run, index) => renderRun(run, index, isReadable));

            return (
                <div ref={rootRef} class={PaintedTextStyles.paintedTextRoot}>
                    <div ref={sourceRef} class={PaintedTextStyles.paintedTextSourceWrap} aria-hidden="true" inert>
                        {slots.default?.()}
                    </div>

                    <div ref={layoutRef} class={PaintedTextStyles.paintedTextLayoutWrap} aria-hidden="true" inert />

                    <svg
                        class={PaintedTextStyles.paintedTextSVG}
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
                                        class={PaintedTextStyles.paintedTextLayer}
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
                                    key={`fill-${index}`}
                                    class={PaintedTextStyles.paintedTextLayer}
                                    fill={paint.fill}
                                    fill-opacity={paint.fillOpacity}
                                    filter={paint.filter}
                                    clip-path={paint.clipPath}
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
                                    key={`stroke-${index}`}
                                    class={PaintedTextStyles.paintedTextLayer}
                                    fill="none"
                                    stroke={paint.fill}
                                    stroke-opacity={paint.fillOpacity}
                                    stroke-width={strokePaint.drawnWidth}
                                    stroke-linejoin="round"
                                    mask={strokePaint.maskKind ? `url(#${maskId})` : undefined}
                                    filter={paint.filter}
                                    clip-path={paint.clipPath}
                                    style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
                                    aria-hidden={isReadable ? undefined : "true"}
                                >
                                    {renderRuns(isReadable)}
                                </text>
                            );
                        })}

                        {atomics.map((node, index) => (
                            <g
                                key={`atomic-${index}`}
                                ref={(group) => {
                                    if (group instanceof SVGGElement && group.firstChild !== node) {
                                        group.replaceChildren(node);
                                    }
                                }}
                            />
                        ))}
                    </svg>
                </div>
            );
        };
    },
    {
        name: "PaintedText",
        slots: Object as SlotsType<PaintedTextSlots>,
        props: declareProps<PaintedTextProps>({
            computeFillDefs: null,
            computeStrokeDefs: null,
            strokeWidth: null,
            strokeAlignment: null,
            onMount: null,
        }),
    },
);
