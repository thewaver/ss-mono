import {
    For,
    Index,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";
import type { ParentProps } from "solid-js";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterRegistration,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextLetter,
    type PaintedTextRun,
    PaintedTextUtils,
    ShapeLayerUtils,
    TrailUtils,
    PaintedTextStyles as styles,
} from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import { PaintAreaContextProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { PaintedTextProps } from "./PaintedTextSolid.types";

const NO_OFFSET = 0;
const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const MASK_PADDING_SIDES = 2;
const EMPTY_STYLE = {};

type LayerAttributes = Record<string, unknown>;

export const PaintedText = (props: ParentProps<PaintedTextProps>) => {
    const maskId = `painted-text-mask-${createUniqueId()}`;
    const pathId = `painted-text-path-${createUniqueId()}`;

    const driver = useLetterDriverContext();

    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, PAINTED_TEXT_DEFAULTS.playback);

    const getIsPageHidden = InteractionTrackerSolidUtils.trackPageHidden();

    const getPath = createMemo(() => access(props.path));

    const getIsOnPath = () => getPath() !== undefined;

    const getIsFittedToPath = createMemo(() => access(props.isFittedToPath) ?? PAINTED_TEXT_DEFAULTS.isFittedToPath);

    const getLapDurationMs = createMemo(() => access(props.lapDurationMs) ?? PAINTED_TEXT_DEFAULTS.lapDurationMs);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getSourceRef, setSourceRef] = createSignal<HTMLElement>();
    const [getLayoutRef, setLayoutRef] = createSignal<HTMLElement>();
    const [getRegistration, setRegistration] = createSignal<LetterRegistration>();

    const getComputePushingAnimationName = () => {
        const computeName = driver?.getComputePushingAnimationName?.();

        if (!computeName || !driver) return undefined;

        return (character: string, index: number) =>
            computeName(character, getOffset() + index, driver.registry.get().characters.length);
    };

    const layout = PaintedTextUtils.createLayout({
        getSource: getSourceRef,
        getLayoutHost: getLayoutRef,
        getIsMeasuringLetters: () => !!driver,
        getComputePushingAnimationName: () => untrack(getComputePushingAnimationName),
        getPath: () => untrack(getPath),
        getIsFittedToPath: () => untrack(getIsFittedToPath),
    });

    const getRuns = accessStore(layout, (state) => state.runs);

    const getAtomics = accessStore(layout, (state) => state.atomics);

    const getLetters = accessStore(layout, (state) => state.letters);

    const getRestLetters = accessStore(layout, (state) => state.restLetters);

    const getWidth = accessStore(layout, (state) => state.width ?? 0);

    const getHeight = accessStore(layout, (state) => state.height);

    const getOrigin = accessStore(layout, (state) => state.origin);

    const getPathLength = accessStore(layout, (state) => state.pathLength);

    const getAscent = accessStore(layout, (state) => state.ascent);

    const getDescent = accessStore(layout, (state) => state.descent);

    const getStartOffset = () => getProgress() * getPathLength();

    const getIsSliding = createMemo(
        () => getIsOnPath() && getIsPlaying() && !getIsPageHidden() && getPathLength() > NO_LENGTH,
    );

    const getSize = createMemo(() => ({ width: getWidth(), height: getHeight() }), undefined, {
        equals: Size2d.isSame,
    });

    const getPaintArea = () => ({ ...getOrigin(), ...getSize() });

    const getRegistryEntries = driver ? accessStore(driver.registry, (state) => state.entries) : () => [];

    const getOffset = () => {
        const root = getRootRef();

        getRegistryEntries();

        return driver && root ? driver.registry.getOffset(root) : NO_OFFSET;
    };

    const getIsPerLetter = () => !!driver?.getIsAnimating();

    const getAtomicLetterIndices = createMemo(() =>
        getLetters().reduce<number[]>((indices, letter, index) => {
            if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

            return indices;
        }, []),
    );

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

    const getLetterStyle = (localIndex: number) =>
        driver && getIsPerLetter()
            ? PaintedTextUtils.computeLetterStyle(
                  driver.getLetterState(getOffset() + localIndex),
                  LetterDriverStyles.letterDriverTimeVar,
              )
            : EMPTY_STYLE;

    const getCaretBox = createMemo(() => {
        if (!driver?.renderCaret || !driver.getCaretIndex) return undefined;

        return PaintedTextUtils.computeCaretBox(
            getLetters(),
            driver.getCaretIndex(),
            getOffset(),
            getIsOnPath() ? { ascent: getAscent(), descent: getDescent() } : undefined,
        );
    });

    const getRunX = (run: PaintedTextRun) => (getIsOnPath() ? undefined : run.x);

    const getRunY = (run: PaintedTextRun) => (getIsOnPath() ? undefined : run.y);

    const renderRun = (run: PaintedTextRun, isReadable: boolean) => {
        if (isReadable && run.anchor) {
            return (
                <tspan x={getRunX(run)} y={getRunY(run)} style={run.style}>
                    <title>{run.title}</title>
                    <a href={run.anchor.href} target={run.anchor.target} rel={run.anchor.rel}>
                        {run.text}
                    </a>
                </tspan>
            );
        }

        if (isReadable && run.title) {
            return (
                <tspan x={getRunX(run)} y={getRunY(run)} style={run.style}>
                    <title>{run.title}</title>
                    {run.text}
                </tspan>
            );
        }

        return (
            <tspan x={getRunX(run)} y={getRunY(run)} style={run.style}>
                {run.text}
            </tspan>
        );
    };

    const renderRuns = (isReadable: boolean) => <For each={getRuns()}>{(run) => renderRun(run, isReadable)}</For>;

    const renderLetter = (letter: PaintedTextLetter, localIndex: number) => {
        const getState = () => driver?.getLetterState(getOffset() + localIndex);
        const getGlyph = () => getState()?.glyph;

        return (
            <text
                class={styles.paintedTextLayer}
                x={getGlyph() ? letter.x + letter.width * 0.5 : letter.x}
                y={letter.baseline}
                text-anchor={getGlyph() ? "middle" : undefined}
                style={{ ...getRuns()[letter.runIndex ?? 0]?.style, ...getLetterStyle(localIndex) }}
            >
                {getGlyph() ?? letter.character}
            </text>
        );
    };

    const renderLetters = () => (
        <For each={getLetters()}>
            {(letter, getIndex) => letter.kind === "text" && renderLetter(letter, getIndex())}
        </For>
    );

    const renderPathLetters = () => (
        <Index each={getLetters()}>
            {(getLetter, localIndex) => (
                <Show when={getLetter().placement}>
                    {(getPlacement) => {
                        const getGlyph = () => driver?.getLetterState(getOffset() + localIndex).glyph;

                        return (
                            <g
                                transform={`translate(${getPlacement().point.x} ${getPlacement().point.y}) rotate(${getPlacement().angle})`}
                            >
                                <text
                                    class={styles.paintedTextLayer}
                                    x={getGlyph() ? 0 : -getPlacement().advance * 0.5}
                                    y={0}
                                    text-anchor={getGlyph() ? "middle" : undefined}
                                    style={{
                                        ...getRuns()[getLetter().runIndex ?? 0]?.style,
                                        ...getLetterStyle(localIndex),
                                    }}
                                >
                                    {getGlyph() ?? getLetter().character}
                                </text>
                            </g>
                        );
                    }}
                </Show>
            )}
        </Index>
    );

    const renderPathText = (
        getAttributes: () => LayerAttributes,
        isReadable: boolean,
        getStartOffsetFor: () => number,
    ) => (
        <text
            class={styles.paintedTextLayer}
            {...getAttributes()}
            textLength={getIsFittedToPath() ? getPathLength() : undefined}
            lengthAdjust={getIsFittedToPath() ? "spacing" : undefined}
            aria-hidden={isReadable ? undefined : "true"}
        >
            <textPath href={`#${pathId}`} startOffset={getStartOffsetFor()}>
                {renderRuns(isReadable)}
            </textPath>
        </text>
    );

    const renderLayer = (getAttributes: () => LayerAttributes, isReadable: boolean) => (
        <Show
            when={getIsPerLetter()}
            fallback={
                <Show
                    when={getIsOnPath()}
                    fallback={
                        <text
                            class={styles.paintedTextLayer}
                            {...getAttributes()}
                            aria-hidden={isReadable ? undefined : "true"}
                        >
                            {renderRuns(isReadable)}
                        </text>
                    }
                >
                    {renderPathText(getAttributes, isReadable, getStartOffset)}
                </Show>
            }
        >
            <g {...getAttributes()} aria-hidden="true">
                <Show when={getIsOnPath()} fallback={renderLetters()}>
                    {renderPathLetters()}
                </Show>
            </g>
        </Show>
    );

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

        const rootRef = getRootRef();

        if (driver && rootRef) {
            const registration = driver.registry.register(rootRef);

            setRegistration(registration);
            onCleanup(registration.unregister);
        }

        const sourceRef = getSourceRef();

        if (!sourceRef) return;

        layout.update();
        onCleanup(layout.observe(sourceRef));
    });

    createEffect(() => getRegistration()?.setCharacters(getLetters().map((letter) => letter.character)));

    createEffect(() => {
        const origin = getOrigin();

        getRegistration()?.setBoxes(
            getRestLetters().map((letter) => ({
                x: letter.x - origin.x,
                y: letter.top - origin.y,
                width: letter.width,
                height: letter.height,
            })),
        );
    });

    createEffect(on([getPath, getIsFittedToPath], () => layout.update(), { defer: true }));

    createEffect(() => layout.placeAlongPath(getStartOffset()));

    createEffect(() => {
        if (!getIsSliding()) return;

        onCleanup(
            TrailUtils.run({
                getProgress: () => untrack(getProgress),
                setProgress,
                getRunDurationMs: getLapDurationMs,
                getIsLooping: () => true,
                onEnd: () => undefined,
            }),
        );
    });

    createEffect(() => {
        if (!driver?.getComputePushingAnimationName) return;

        const offset = getOffset();
        const styles = getRestLetters().map((_, index) => {
            const animation = driver.getLetterState(offset + index).animation;

            return animation
                ? LetterDriverUtils.computeAnimationStyle(animation, LetterDriverStyles.letterDriverTimeVar)
                : undefined;
        });

        layout.relayout(styles);
    });

    return (
        <div
            ref={setRootRef}
            class={styles.paintedTextRoot}
            style={getIsOnPath() ? { width: `${getWidth()}px`, height: `${getHeight()}px` } : undefined}
        >
            <div ref={setSourceRef} class={styles.paintedTextSourceWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            <div
                ref={setLayoutRef}
                class={styles.paintedTextLayoutWrap}
                classList={{ [styles.paintedTextLayoutWrapOnPath]: getIsOnPath() }}
                aria-hidden="true"
                inert
            />

            <svg
                class={styles.paintedTextSVG}
                width={getWidth()}
                height={getHeight()}
                viewBox={`${getOrigin().x} ${getOrigin().y} ${getWidth()} ${getHeight()}`}
                style={driver?.getIsHidden() ? { visibility: "hidden" } : undefined}
            >
                <defs>
                    <PaintAreaContextProvider value={{ getPaintArea }}>
                        {renderDefsElements(getFillDefs())}
                        {renderDefsElements(getStrokeDefs())}
                    </PaintAreaContextProvider>

                    <Show when={getPath()}>
                        {(getD) => <path id={pathId} d={PaintedTextUtils.computeLapPath(getD())} />}
                    </Show>

                    <Show when={getStrokePaint().maskKind}>
                        {(getMaskKind) => (
                            <mask
                                id={maskId}
                                maskUnits="userSpaceOnUse"
                                x={getOrigin().x - getMaskPadding()}
                                y={getOrigin().y - getMaskPadding()}
                                width={getWidth() + getMaskPadding() * MASK_PADDING_SIDES}
                                height={getHeight() + getMaskPadding() * MASK_PADDING_SIDES}
                            >
                                {getMaskKind() === "outside" && (
                                    <rect
                                        x={getOrigin().x - getMaskPadding()}
                                        y={getOrigin().y - getMaskPadding()}
                                        width={getWidth() + getMaskPadding() * MASK_PADDING_SIDES}
                                        height={getHeight() + getMaskPadding() * MASK_PADDING_SIDES}
                                        fill="white"
                                    />
                                )}

                                {renderLayer(() => ({ fill: getMaskKind() === "outside" ? "black" : "white" }), false)}
                            </mask>
                        )}
                    </Show>
                </defs>

                <Show when={getIsPerLetter()}>
                    <Show
                        when={getIsOnPath()}
                        fallback={
                            <text class={styles.paintedTextLayer} opacity={0}>
                                {renderRuns(true)}
                            </text>
                        }
                    >
                        {renderPathText(() => ({ opacity: 0 }), true, getStartOffset)}
                    </Show>
                </Show>

                <For each={getFillDefs()}>
                    {(def, getIndex) => {
                        const paint = ShapeLayerUtils.computePaint(def);
                        const isReadable = PaintedTextUtils.getIsReadableLayer(
                            "fill",
                            getIndex(),
                            getFillDefs().length,
                        );

                        return renderLayer(
                            () => ({
                                "fill": paint.fill,
                                "fill-opacity": paint.fillOpacity,
                                "filter": paint.filter,
                                "clip-path": paint.clipPath,
                                "style": paint.mixBlendMode ? { "mix-blend-mode": paint.mixBlendMode } : undefined,
                            }),
                            isReadable,
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

                        return renderLayer(
                            () => ({
                                "fill": "none",
                                "stroke": paint.fill,
                                "stroke-opacity": paint.fillOpacity,
                                "stroke-width": getStrokePaint().drawnWidth,
                                "stroke-linejoin": "round",
                                "mask": getStrokePaint().maskKind ? `url(#${maskId})` : undefined,
                                "filter": paint.filter,
                                "clip-path": paint.clipPath,
                                "style": paint.mixBlendMode ? { "mix-blend-mode": paint.mixBlendMode } : undefined,
                            }),
                            isReadable,
                        );
                    }}
                </For>

                <For each={getAtomics()}>
                    {(node, getIndex) => <g style={getLetterStyle(getAtomicLetterIndices()[getIndex()])}>{node}</g>}
                </For>
            </svg>

            <Show when={getCaretBox()} keyed>
                {(box) => (
                    <div class={styles.paintedTextCaret} style={PaintedTextUtils.computeCaretStyle(box, getOrigin())}>
                        {driver?.renderCaret?.()}
                    </div>
                )}
            </Show>
        </div>
    );
};
