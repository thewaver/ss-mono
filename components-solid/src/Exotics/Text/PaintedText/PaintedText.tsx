import { For, Show, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { ParentProps } from "solid-js";

import {
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextRun,
    PaintedTextUtils,
    ShapeLayerUtils,
    PaintedTextStyles as styles,
} from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { PaintedTextProps } from "./PaintedTextSolid.types";

export const PaintedText = (props: ParentProps<PaintedTextProps>) => {
    const maskId = `painted-text-mask-${createUniqueId()}`;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getSourceRef, setSourceRef] = createSignal<HTMLElement>();
    const [getLayoutRef, setLayoutRef] = createSignal<HTMLElement>();

    const layout = PaintedTextUtils.createLayout({ getSource: getSourceRef, getLayoutHost: getLayoutRef });

    const getRuns = accessStore(layout, (state) => state.runs);

    const getAtomics = accessStore(layout, (state) => state.atomics);

    const getWidth = accessStore(layout, (state) => state.width ?? 0);

    const getHeight = accessStore(layout, (state) => state.height);

    const getSize = createMemo(() => ({ width: getWidth(), height: getHeight() }), undefined, {
        equals: Size2d.isSame,
    });

    const getStrokePaint = createMemo(() =>
        PaintedTextUtils.computeStrokePaint(
            access(props.strokeAlignment) ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
            access(props.strokeWidth) ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
        ),
    );

    const getStrokeDefs = createMemo(() => props.computeStrokeDefs?.(getSize, getRootRef) ?? []);

    const getFillDefs = createMemo(() =>
        PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(getSize, getRootRef), getStrokeDefs()),
    );

    const getMaskPadding = () => getStrokePaint().drawnWidth;

    const renderRun = (run: PaintedTextRun, isReadable: boolean) => {
        if (isReadable && run.anchor) {
            return (
                <tspan x={run.x} y={run.y} style={run.style}>
                    <title>{run.title}</title>
                    <a href={run.anchor.href} target={run.anchor.target} rel={run.anchor.rel}>
                        {run.text}
                    </a>
                </tspan>
            );
        }

        if (isReadable && run.title) {
            return (
                <tspan x={run.x} y={run.y} style={run.style}>
                    <title>{run.title}</title>
                    {run.text}
                </tspan>
            );
        }

        return (
            <tspan x={run.x} y={run.y} style={run.style}>
                {run.text}
            </tspan>
        );
    };

    const renderRuns = (isReadable: boolean) => <For each={getRuns()}>{(run) => renderRun(run, isReadable)}</For>;

    const renderDefsElements = (defs: SVGDefs[]) => (
        <For each={defs}>
            {(def) => (
                <>
                    {def.gradientOrPattern?.renderDefsElement()}
                    {def.filter?.renderDefsElement()}
                    {def.clipPath?.renderDefsElement()}
                </>
            )}
        </For>
    );

    onMount(() => {
        props.onMount?.({ update: layout.update });

        const sourceRef = getSourceRef();

        if (!sourceRef) return;

        onCleanup(layout.observe(sourceRef));
    });

    return (
        <div ref={setRootRef} class={styles.paintedTextRoot}>
            <div ref={setSourceRef} class={styles.paintedTextSourceWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            <div ref={setLayoutRef} class={styles.paintedTextLayoutWrap} aria-hidden="true" inert />

            <svg
                class={styles.paintedTextSVG}
                width={getWidth()}
                height={getHeight()}
                viewBox={`0 0 ${getWidth()} ${getHeight()}`}
            >
                <defs>
                    {renderDefsElements(getFillDefs())}
                    {renderDefsElements(getStrokeDefs())}

                    <Show when={getStrokePaint().maskKind}>
                        {(getMaskKind) => (
                            <mask
                                id={maskId}
                                maskUnits="userSpaceOnUse"
                                x={-getMaskPadding()}
                                y={-getMaskPadding()}
                                width={getWidth() + getMaskPadding() * 2}
                                height={getHeight() + getMaskPadding() * 2}
                            >
                                {getMaskKind() === "outside" && (
                                    <rect
                                        x={-getMaskPadding()}
                                        y={-getMaskPadding()}
                                        width={getWidth() + getMaskPadding() * 2}
                                        height={getHeight() + getMaskPadding() * 2}
                                        fill="white"
                                    />
                                )}

                                <text
                                    class={styles.paintedTextLayer}
                                    fill={getMaskKind() === "outside" ? "black" : "white"}
                                >
                                    {renderRuns(false)}
                                </text>
                            </mask>
                        )}
                    </Show>
                </defs>

                <For each={getFillDefs()}>
                    {(def, getIndex) => {
                        const paint = ShapeLayerUtils.computePaint(def);
                        const isReadable = PaintedTextUtils.getIsReadableLayer(
                            "fill",
                            getIndex(),
                            getFillDefs().length,
                        );

                        return (
                            <text
                                class={styles.paintedTextLayer}
                                fill={paint.fill}
                                fill-opacity={paint.fillOpacity}
                                filter={paint.filter}
                                clip-path={paint.clipPath}
                                style={paint.mixBlendMode ? { "mix-blend-mode": paint.mixBlendMode } : undefined}
                                aria-hidden={isReadable ? undefined : "true"}
                            >
                                {renderRuns(isReadable)}
                            </text>
                        );
                    }}
                </For>

                <For each={getStrokeDefs()}>
                    {(def, getIndex) => {
                        const paint = ShapeLayerUtils.computePaint(def);
                        const isReadable = PaintedTextUtils.getIsReadableLayer(
                            "stroke",
                            getIndex(),
                            getFillDefs().length,
                        );

                        return (
                            <text
                                class={styles.paintedTextLayer}
                                fill="none"
                                stroke={paint.fill}
                                stroke-opacity={paint.fillOpacity}
                                stroke-width={getStrokePaint().drawnWidth}
                                stroke-linejoin="round"
                                mask={getStrokePaint().maskKind ? `url(#${maskId})` : undefined}
                                filter={paint.filter}
                                clip-path={paint.clipPath}
                                style={paint.mixBlendMode ? { "mix-blend-mode": paint.mixBlendMode } : undefined}
                                aria-hidden={isReadable ? undefined : "true"}
                            >
                                {renderRuns(isReadable)}
                            </text>
                        );
                    }}
                </For>

                <For each={getAtomics()}>{(node) => node}</For>
            </svg>
        </div>
    );
};
