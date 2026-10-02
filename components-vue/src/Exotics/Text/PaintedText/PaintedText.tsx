import { type CSSProperties, Fragment, type SlotsType, defineComponent, nextTick, shallowRef, useId } from "vue";

import {
    LetterDriverUtils,
    type LetterRegistration,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextLetter,
    type PaintedTextRun,
    PaintedTextStyles,
    PaintedTextUtils,
    ShapeLayerUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { PaintAreaProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { PaintedTextController, PaintedTextProps, PaintedTextSlots } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;
const NO_OFFSET = 0;
const BEFORE_FIRST = -1;
const NO_REGISTRY = LetterDriverUtils.createRegistry();

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

        const driver = useLetterDriverContext();

        const rootRef = shallowRef<HTMLDivElement>();
        const sourceRef = shallowRef<HTMLDivElement>();
        const layoutRef = shallowRef<HTMLDivElement>();

        const layout = PaintedTextUtils.createLayout({
            getSource: () => sourceRef.value,
            getLayoutHost: () => layoutRef.value,
            getIsMeasuringLetters: () => !!driver,
        });

        const state = useStore(layout);
        const registryState = useStore(driver?.registry ?? NO_REGISTRY);

        let registration: LetterRegistration | undefined;

        const controller: PaintedTextController = {
            update: () => {
                if (!sourceRef.value) return false;

                void nextTick(() => layout.update());

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);

            const root = rootRef.value;

            if (driver && root) registration = driver.registry.register(root);

            const source = sourceRef.value;
            const stopObserving = source ? layout.observe(source) : undefined;

            return () => {
                stopObserving?.();
                registration?.unregister();
                registration = undefined;
            };
        });

        const getPaintArea = () => ({ x: 0, y: 0, width: state.value.width ?? 0, height: state.value.height });

        watchAfterRender([() => state.value.letters], ([letters]) => {
            registration?.setCharacters(letters.map((letter) => letter.character));
        });

        return () => {
            const { runs, atomics, letters, height } = state.value;
            const width = state.value.width ?? 0;
            const size = { width, height };
            const strokePaint = PaintedTextUtils.computeStrokePaint(
                props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
                props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
            );
            const strokeDefs = props.computeStrokeDefs?.(size, rootRef.value) ?? [];
            const fillDefs = PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, rootRef.value), strokeDefs);
            const maskPadding = strokePaint.drawnWidth;

            void registryState.value;

            const offset = driver && rootRef.value ? driver.registry.getOffset(rootRef.value) : NO_OFFSET;
            const isPerLetter = !!driver?.getIsAnimating();

            const getLetterStyle = (localIndex: number) =>
                driver && isPerLetter
                    ? PaintedTextUtils.computeLetterStyle(driver.getLetterState(offset + localIndex))
                    : undefined;

            const atomicLetterIndices = letters.reduce<number[]>((indices, letter, index) => {
                if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

                return indices;
            }, []);

            const computeCaretBox = () => {
                const caretIndex = driver?.getCaretIndex?.();

                if (!driver?.renderCaret || caretIndex === undefined) return undefined;

                if (caretIndex === BEFORE_FIRST) {
                    const first = letters[0];

                    return offset === NO_OFFSET && first
                        ? { x: first.x, top: first.top, height: first.height }
                        : undefined;
                }

                const letter = letters[caretIndex - offset];

                return letter ? { x: letter.x + letter.width, top: letter.top, height: letter.height } : undefined;
            };

            const caretBox = computeCaretBox();

            const renderRuns = (isReadable: boolean) => runs.map((run, index) => renderRun(run, index, isReadable));

            const renderLetter = (letter: PaintedTextLetter, localIndex: number, isReporting: boolean) => {
                const letterState = driver?.getLetterState(offset + localIndex);
                const letterStyle = getLetterStyle(localIndex);

                return (
                    <text
                        key={localIndex}
                        class={PaintedTextStyles.paintedTextLayer}
                        x={letterState?.glyph ? letter.x + letter.width * 0.5 : letter.x}
                        y={letter.baseline}
                        text-anchor={letterState?.glyph ? "middle" : undefined}
                        style={toVueStyle({ ...runs[letter.runIndex ?? 0]?.style, ...letterStyle })}
                        onAnimationstart={
                            isReporting
                                ? (event: AnimationEvent) => {
                                      if (event.target === event.currentTarget) {
                                          driver?.reportLetterStart?.(offset + localIndex);
                                      }
                                  }
                                : undefined
                        }
                    >
                        {letterState?.glyph ?? letter.character}
                    </text>
                );
            };

            const renderLetters = (isReporting: boolean) =>
                letters.map((letter, index) => letter.kind === "text" && renderLetter(letter, index, isReporting));

            const renderLayer = (key: string, attributes: Record<string, unknown>, isReadable: boolean) =>
                isPerLetter ? (
                    <g key={key} {...attributes} aria-hidden="true">
                        {renderLetters(isReadable)}
                    </g>
                ) : (
                    <text
                        key={key}
                        class={PaintedTextStyles.paintedTextLayer}
                        {...attributes}
                        aria-hidden={isReadable ? undefined : "true"}
                    >
                        {renderRuns(isReadable)}
                    </text>
                );

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
                        style={driver?.getIsHidden() ? { visibility: "hidden" } : undefined}
                    >
                        <defs>
                            <PaintAreaProvider getPaintArea={getPaintArea}>
                                {renderDefsElements(fillDefs)}
                                {renderDefsElements(strokeDefs)}
                            </PaintAreaProvider>

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

                                    {renderLayer(
                                        "mask",
                                        { fill: strokePaint.maskKind === "outside" ? "black" : "white" },
                                        false,
                                    )}
                                </mask>
                            )}
                        </defs>

                        {isPerLetter && (
                            <text class={PaintedTextStyles.paintedTextLayer} opacity={0}>
                                {renderRuns(true)}
                            </text>
                        )}

                        {fillDefs.map((def, index) => {
                            const paint = ShapeLayerUtils.computePaint(def);

                            return renderLayer(
                                `fill-${index}`,
                                {
                                    "fill": paint.fill,
                                    "fill-opacity": paint.fillOpacity,
                                    "filter": paint.filter,
                                    "clip-path": paint.clipPath,
                                    "style": paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                                },
                                PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length),
                            );
                        })}

                        {strokeDefs.map((def, index) => {
                            const paint = ShapeLayerUtils.computePaint(def);

                            return renderLayer(
                                `stroke-${index}`,
                                {
                                    "fill": "none",
                                    "stroke": paint.fill,
                                    "stroke-opacity": paint.fillOpacity,
                                    "stroke-width": strokePaint.drawnWidth,
                                    "stroke-linejoin": "round",
                                    "mask": strokePaint.maskKind ? `url(#${maskId})` : undefined,
                                    "filter": paint.filter,
                                    "clip-path": paint.clipPath,
                                    "style": paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                                },
                                PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length),
                            );
                        })}

                        {atomics.map((node, index) => {
                            const letterStyle = getLetterStyle(atomicLetterIndices[index]);

                            return (
                                <g
                                    key={`atomic-${index}`}
                                    style={letterStyle && toVueStyle(letterStyle)}
                                    ref={(group) => {
                                        if (group instanceof SVGGElement && group.firstChild !== node) {
                                            group.replaceChildren(node);
                                        }
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {caretBox && (
                        <div
                            key={`${caretBox.x}-${caretBox.top}`}
                            class={PaintedTextStyles.paintedTextCaret}
                            style={{
                                left: `${caretBox.x}px`,
                                top: `${caretBox.top}px`,
                                height: `${caretBox.height}px`,
                            }}
                        >
                            {driver?.renderCaret?.()}
                        </div>
                    )}
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
