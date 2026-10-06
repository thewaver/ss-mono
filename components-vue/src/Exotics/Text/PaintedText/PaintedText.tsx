import {
    type CSSProperties,
    Fragment,
    type SlotsType,
    computed,
    defineComponent,
    nextTick,
    shallowRef,
    useId,
} from "vue";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterRegistration,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextLetter,
    type PaintedTextRun,
    PaintedTextStyles,
    PaintedTextUtils,
    ShapeLayerUtils,
    TrailUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { PaintAreaProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { PaintedTextController, PaintedTextProps, PaintedTextSlots } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;
const NO_OFFSET = 0;
const NO_LENGTH = 0;
const NO_PROGRESS = 0;
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

const renderRun = (run: PaintedTextRun, index: number, isReadable: boolean, isOnPath: boolean) => (
    <tspan key={index} x={isOnPath ? undefined : run.x} y={isOnPath ? undefined : run.y} style={toVueStyle(run.style)}>
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
        const pathId = `painted-text-path-${useId()}`;

        const driver = useLetterDriverContext();

        const progress = useTwoWay(props, "progress", NO_PROGRESS);
        const isPlaying = useTwoWay(props, "playback", PAINTED_TEXT_DEFAULTS.playback);

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const getIsFittedToPath = () => props.isFittedToPath ?? PAINTED_TEXT_DEFAULTS.isFittedToPath;

        const rootRef = shallowRef<HTMLDivElement>();
        const sourceRef = shallowRef<HTMLDivElement>();
        const layoutRef = shallowRef<HTMLDivElement>();

        const getOffset = () => (driver && rootRef.value ? driver.registry.getOffset(rootRef.value) : NO_OFFSET);

        const getComputePushingAnimationName = () => {
            const computeName = driver?.getComputePushingAnimationName?.();

            if (!computeName || !driver) return undefined;

            return (character: string, index: number) =>
                computeName(character, getOffset() + index, driver.registry.get().characters.length);
        };

        const layout = PaintedTextUtils.createLayout({
            getSource: () => sourceRef.value,
            getLayoutHost: () => layoutRef.value,
            getIsMeasuringLetters: () => !!driver,
            getComputePushingAnimationName,
            getPath: () => props.path,
            getIsFittedToPath,
        });

        const state = useStore(layout);
        const restLetters = useStore(layout, (value) => value.restLetters);
        const origin = useStore(layout, (value) => value.origin);
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

            if (source) layout.update();

            const stopObserving = source ? layout.observe(source) : undefined;

            return () => {
                stopObserving?.();
                registration?.unregister();
                registration = undefined;
            };
        });

        const getPaintArea = () => ({
            ...origin.value,
            width: state.value.width ?? 0,
            height: state.value.height,
        });

        const getStartOffset = () => progress.value * state.value.pathLength;

        const isSliding = computed(
            () =>
                props.path !== undefined &&
                isPlaying.value &&
                !isPageHidden.value &&
                state.value.pathLength > NO_LENGTH,
        );

        watchAfterRender([() => props.path, getIsFittedToPath], () => {
            layout.update();
        });

        watchAfterRender([getStartOffset], ([offset]) => {
            layout.placeAlongPath(offset);
        });

        watchAfterRender([isSliding], ([sliding]) => {
            if (!sliding) return;

            return TrailUtils.run({
                getProgress: () => progress.value,
                setProgress: (value) => {
                    progress.value = value;
                },
                getRunDurationMs: () => props.lapDurationMs ?? PAINTED_TEXT_DEFAULTS.lapDurationMs,
                getIsLooping: () => true,
                onEnd: () => undefined,
            });
        });

        watchAfterRender([() => state.value.letters], ([letters]) =>
            registration?.setCharacters(letters.map((letter) => letter.character)),
        );

        watchAfterRender([restLetters, origin], ([letters, letterOrigin]) =>
            registration?.setBoxes(
                letters.map((letter) => ({
                    x: letter.x - letterOrigin.x,
                    y: letter.top - letterOrigin.y,
                    width: letter.width,
                    height: letter.height,
                })),
            ),
        );

        const computePushingStyles = () => {
            if (!driver?.getComputePushingAnimationName) return undefined;

            void registryState.value;

            const offset = getOffset();

            return restLetters.value.map((_, index) => {
                const animation = driver.getLetterState(offset + index).animation;

                return animation
                    ? LetterDriverUtils.computeAnimationStyle(animation, LetterDriverStyles.letterDriverTimeVar)
                    : undefined;
            });
        };

        watchAfterRender([computePushingStyles], ([styles]) => {
            if (styles) layout.relayout(styles);
        });

        return () => {
            const { runs, atomics, letters, height, pathLength, ascent, descent } = state.value;
            const isOnPath = props.path !== undefined;
            const isFittedToPath = getIsFittedToPath();
            const startOffset = getStartOffset();
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

            const offset = getOffset();
            const isPerLetter = !!driver?.getIsAnimating();

            const getLetterStyle = (localIndex: number) =>
                driver && isPerLetter
                    ? PaintedTextUtils.computeLetterStyle(
                          driver.getLetterState(offset + localIndex),
                          LetterDriverStyles.letterDriverTimeVar,
                      )
                    : undefined;

            const atomicLetterIndices = letters.reduce<number[]>((indices, letter, index) => {
                if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

                return indices;
            }, []);

            const caretIndex = driver?.getCaretIndex?.();
            const caretBox =
                driver?.renderCaret && caretIndex !== undefined
                    ? PaintedTextUtils.computeCaretBox(
                          letters,
                          caretIndex,
                          offset,
                          isOnPath ? { ascent, descent } : undefined,
                      )
                    : undefined;

            const renderRuns = (isReadable: boolean) =>
                runs.map((run, index) => renderRun(run, index, isReadable, isOnPath));

            const renderLetter = (letter: PaintedTextLetter, localIndex: number) => {
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
                    >
                        {letterState?.glyph ?? letter.character}
                    </text>
                );
            };

            const renderLetters = () =>
                letters.map((letter, index) => letter.kind === "text" && renderLetter(letter, index));

            const renderPathLetter = (letter: PaintedTextLetter, localIndex: number) => {
                const placement = letter.placement;

                if (!placement) return undefined;

                const letterState = driver?.getLetterState(offset + localIndex);
                const letterStyle = getLetterStyle(localIndex);

                return (
                    <g
                        key={localIndex}
                        transform={`translate(${placement.point.x} ${placement.point.y}) rotate(${placement.angle})`}
                    >
                        <text
                            class={PaintedTextStyles.paintedTextLayer}
                            x={letterState?.glyph ? 0 : -placement.advance * 0.5}
                            y={0}
                            text-anchor={letterState?.glyph ? "middle" : undefined}
                            style={toVueStyle({ ...runs[letter.runIndex ?? 0]?.style, ...letterStyle })}
                        >
                            {letterState?.glyph ?? letter.character}
                        </text>
                    </g>
                );
            };

            const renderPathText = (
                key: string,
                attributes: Record<string, unknown>,
                isReadable: boolean,
                textOffset: number,
            ) => (
                <text
                    key={key}
                    class={PaintedTextStyles.paintedTextLayer}
                    {...attributes}
                    textLength={isFittedToPath ? pathLength : undefined}
                    lengthAdjust={isFittedToPath ? "spacing" : undefined}
                    aria-hidden={isReadable ? undefined : "true"}
                >
                    <textPath href={`#${pathId}`} startOffset={textOffset}>
                        {renderRuns(isReadable)}
                    </textPath>
                </text>
            );

            const renderLayer = (key: string, attributes: Record<string, unknown>, isReadable: boolean) =>
                isPerLetter ? (
                    <g key={key} {...attributes} aria-hidden="true">
                        {isOnPath ? letters.map(renderPathLetter) : renderLetters()}
                    </g>
                ) : isOnPath ? (
                    renderPathText(key, attributes, isReadable, startOffset)
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
                <div
                    ref={rootRef}
                    class={PaintedTextStyles.paintedTextRoot}
                    style={isOnPath ? { width: `${width}px`, height: `${height}px` } : undefined}
                >
                    <div ref={sourceRef} class={PaintedTextStyles.paintedTextSourceWrap} aria-hidden="true" inert>
                        {slots.default?.()}
                    </div>

                    <div
                        ref={layoutRef}
                        class={[
                            PaintedTextStyles.paintedTextLayoutWrap,
                            isOnPath && PaintedTextStyles.paintedTextLayoutWrapOnPath,
                        ]}
                        aria-hidden="true"
                        inert
                    />

                    <svg
                        class={PaintedTextStyles.paintedTextSVG}
                        width={width}
                        height={height}
                        viewBox={`${origin.value.x} ${origin.value.y} ${width} ${height}`}
                        style={driver?.getIsHidden() ? { visibility: "hidden" } : undefined}
                    >
                        <defs>
                            <PaintAreaProvider getPaintArea={getPaintArea}>
                                {renderDefsElements(fillDefs)}
                                {renderDefsElements(strokeDefs)}
                            </PaintAreaProvider>

                            {isOnPath && <path id={pathId} d={PaintedTextUtils.computeLapPath(props.path!)} />}

                            {strokePaint.maskKind && (
                                <mask
                                    id={maskId}
                                    maskUnits="userSpaceOnUse"
                                    x={origin.value.x - maskPadding}
                                    y={origin.value.y - maskPadding}
                                    width={width + maskPadding * MASK_PADDING_SIDES}
                                    height={height + maskPadding * MASK_PADDING_SIDES}
                                >
                                    {strokePaint.maskKind === "outside" && (
                                        <rect
                                            x={origin.value.x - maskPadding}
                                            y={origin.value.y - maskPadding}
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

                        {isPerLetter &&
                            (isOnPath ? (
                                renderPathText("readable", { opacity: 0 }, true, startOffset)
                            ) : (
                                <text class={PaintedTextStyles.paintedTextLayer} opacity={0}>
                                    {renderRuns(true)}
                                </text>
                            ))}

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
                            style={toVueStyle(PaintedTextUtils.computeCaretStyle(caretBox, origin.value))}
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
            "computeFillDefs": null,
            "computeStrokeDefs": null,
            "strokeWidth": null,
            "strokeAlignment": null,
            "path": null,
            "isFittedToPath": Boolean,
            "lapDurationMs": null,
            "progress": null,
            "onUpdate:progress": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onMount": null,
        }),
    },
);
