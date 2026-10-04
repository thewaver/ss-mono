import {
    For,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
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
    PaintedTextStyles as styles,
} from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefsSolid.types";
import { PaintAreaContextProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { PaintedTextProps } from "./PaintedTextSolid.types";

const NO_OFFSET = 0;
const BEFORE_FIRST = -1;
const MASK_PADDING_SIDES = 2;
const EMPTY_STYLE = {};

type LayerAttributes = Record<string, unknown>;

export const PaintedText = (props: ParentProps<PaintedTextProps>) => {
    const maskId = `painted-text-mask-${createUniqueId()}`;

    const driver = useLetterDriverContext();

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
    });

    const getRuns = accessStore(layout, (state) => state.runs);

    const getAtomics = accessStore(layout, (state) => state.atomics);

    const getLetters = accessStore(layout, (state) => state.letters);

    const getRestLetters = accessStore(layout, (state) => state.restLetters);

    const getWidth = accessStore(layout, (state) => state.width ?? 0);

    const getHeight = accessStore(layout, (state) => state.height);

    const getSize = createMemo(() => ({ width: getWidth(), height: getHeight() }), undefined, {
        equals: Size2d.isSame,
    });

    const getPaintArea = () => ({ x: 0, y: 0, ...getSize() });

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

        const caretIndex = driver.getCaretIndex();

        const letters = getLetters();
        const offset = getOffset();

        if (caretIndex === BEFORE_FIRST) {
            const first = letters[0];

            return offset === NO_OFFSET && first ? { x: first.x, top: first.top, height: first.height } : undefined;
        }

        const letter = letters[caretIndex - offset];

        return letter ? { x: letter.x + letter.width, top: letter.top, height: letter.height } : undefined;
    });

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

    const renderLayer = (getAttributes: () => LayerAttributes, isReadable: boolean) => (
        <Show
            when={getIsPerLetter()}
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
            <g {...getAttributes()} aria-hidden="true">
                {renderLetters()}
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

        onCleanup(layout.observe(sourceRef));
    });

    createEffect(() => getRegistration()?.setCharacters(getLetters().map((letter) => letter.character)));

    createEffect(() =>
        getRegistration()?.setBoxes(
            getRestLetters().map((letter) => ({
                x: letter.x,
                y: letter.top,
                width: letter.width,
                height: letter.height,
            })),
        ),
    );

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
                style={driver?.getIsHidden() ? { visibility: "hidden" } : undefined}
            >
                <defs>
                    <PaintAreaContextProvider value={{ getPaintArea }}>
                        {renderDefsElements(getFillDefs())}
                        {renderDefsElements(getStrokeDefs())}
                    </PaintAreaContextProvider>

                    <Show when={getStrokePaint().maskKind}>
                        {(getMaskKind) => (
                            <mask
                                id={maskId}
                                maskUnits="userSpaceOnUse"
                                x={-getMaskPadding()}
                                y={-getMaskPadding()}
                                width={getWidth() + getMaskPadding() * MASK_PADDING_SIDES}
                                height={getHeight() + getMaskPadding() * MASK_PADDING_SIDES}
                            >
                                {getMaskKind() === "outside" && (
                                    <rect
                                        x={-getMaskPadding()}
                                        y={-getMaskPadding()}
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
                    <text class={styles.paintedTextLayer} opacity={0}>
                        {renderRuns(true)}
                    </text>
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
                    <div
                        class={styles.paintedTextCaret}
                        style={{ left: `${box.x}px`, top: `${box.top}px`, height: `${box.height}px` }}
                    >
                        {driver?.renderCaret?.()}
                    </div>
                )}
            </Show>
        </div>
    );
};
