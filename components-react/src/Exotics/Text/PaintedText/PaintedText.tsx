import {
    type CSSProperties,
    Fragment,
    type SVGProps,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";

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
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { PaintAreaContextProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { useElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;
const NO_OFFSET = 0;
const BEFORE_FIRST = -1;
const NO_REGISTRY = LetterDriverUtils.createRegistry();

type LayerAttributes = SVGProps<SVGTextElement> & SVGProps<SVGGElement>;

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

    const driver = useLetterDriverContext();

    const rootRef = useRef<HTMLDivElement>(null);
    const rootElement = useElement(rootRef);
    const sourceRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const registrationRef = useRef<LetterRegistration>(undefined);
    const isDrivenRef = useRef(!!driver);

    isDrivenRef.current = !!driver;

    const computePushingName = driver?.computePushingAnimationName;
    const computePushingNameRef = useRef<((character: string, index: number) => string) | undefined>(undefined);

    computePushingNameRef.current =
        computePushingName && driver
            ? (character, index) =>
                  computePushingName(
                      character,
                      (rootRef.current ? driver.registry.getOffset(rootRef.current) : NO_OFFSET) + index,
                      driver.registry.get().characters.length,
                  )
            : undefined;

    const [layout] = useState(() =>
        PaintedTextUtils.createLayout({
            getSource: () => sourceRef.current ?? undefined,
            getLayoutHost: () => layoutRef.current ?? undefined,
            getIsMeasuringLetters: () => isDrivenRef.current,
            getComputePushingAnimationName: () => computePushingNameRef.current,
        }),
    );

    const runs = useStore(layout, (state) => state.runs);
    const atomics = useStore(layout, (state) => state.atomics);
    const letters = useStore(layout, (state) => state.letters);
    const restLetters = useStore(layout, (state) => state.restLetters);
    const width = useStore(layout, (state) => state.width ?? 0);
    const height = useStore(layout, (state) => state.height);

    useStore(driver?.registry ?? NO_REGISTRY, (state) => state.entries);

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
        const root = rootRef.current;

        if (!driver || !root) return;

        const registration = driver.registry.register(root);

        registrationRef.current = registration;

        return () => {
            registrationRef.current = undefined;
            registration.unregister();
        };
    }, [driver?.registry]);

    useLayoutEffect(() => {
        const source = sourceRef.current;

        return source ? layout.observe(source) : undefined;
    }, [layout]);

    useEffect(() => {
        registrationRef.current?.setCharacters(letters.map((letter) => letter.character));
    }, [letters]);

    useEffect(() => {
        registrationRef.current?.setBoxes(
            restLetters.map((letter) => ({ x: letter.x, y: letter.top, width: letter.width, height: letter.height })),
        );
    }, [restLetters]);

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const size = { width, height };
    const paintAreaContext = useMemo(() => ({ paintArea: { x: 0, y: 0, width, height } }), [width, height]);
    const strokePaint = PaintedTextUtils.computeStrokePaint(
        props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
        props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
    );
    const strokeDefs = props.computeStrokeDefs?.(size, rootElement) ?? [];
    const fillDefs = PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, rootElement), strokeDefs);
    const maskPadding = strokePaint.drawnWidth;

    const offset = driver && rootRef.current ? driver.registry.getOffset(rootRef.current) : NO_OFFSET;
    const isPerLetter = !!driver?.isAnimating;

    const pushingStyles = computePushingName
        ? restLetters.map((_, index) => {
              const animation = driver?.getLetterState(offset + index).animation;

              return animation
                  ? LetterDriverUtils.computeAnimationStyle(animation, LetterDriverStyles.letterDriverTimeVar)
                  : undefined;
          })
        : undefined;
    const pushingKey = pushingStyles && JSON.stringify(pushingStyles);

    useLayoutEffect(() => {
        if (pushingStyles) layout.relayout(pushingStyles);
    }, [restLetters, pushingKey]);

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

    const computeCaretBox = () => {
        if (!driver?.renderCaret || driver.caretIndex === undefined) return undefined;

        if (driver.caretIndex === BEFORE_FIRST) {
            const first = letters[0];

            return offset === NO_OFFSET && first ? { x: first.x, top: first.top, height: first.height } : undefined;
        }

        const letter = letters[driver.caretIndex - offset];

        return letter ? { x: letter.x + letter.width, top: letter.top, height: letter.height } : undefined;
    };

    const caretBox = computeCaretBox();

    const renderRuns = (isReadable: boolean) => runs.map((run, index) => renderRun(run, index, isReadable));

    const renderLetter = (letter: PaintedTextLetter, localIndex: number) => {
        const state = driver?.getLetterState(offset + localIndex);
        const letterStyle = getLetterStyle(localIndex);

        return (
            <text
                key={localIndex}
                className={PaintedTextStyles.paintedTextLayer}
                x={state?.glyph ? letter.x + letter.width * 0.5 : letter.x}
                y={letter.baseline}
                textAnchor={state?.glyph ? "middle" : undefined}
                style={toReactStyle({ ...runs[letter.runIndex ?? 0]?.style, ...letterStyle })}
            >
                {state?.glyph ?? letter.character}
            </text>
        );
    };

    const renderLetters = () => letters.map((letter, index) => letter.kind === "text" && renderLetter(letter, index));

    const renderLayer = (key: string, attributes: LayerAttributes, isReadable: boolean) =>
        isPerLetter ? (
            <g key={key} {...(attributes as SVGProps<SVGGElement>)} aria-hidden="true">
                {renderLetters()}
            </g>
        ) : (
            <text
                key={key}
                className={PaintedTextStyles.paintedTextLayer}
                {...(attributes as SVGProps<SVGTextElement>)}
                aria-hidden={isReadable ? undefined : "true"}
            >
                {renderRuns(isReadable)}
            </text>
        );

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
                style={driver?.isHidden ? { visibility: "hidden" } : undefined}
            >
                <defs>
                    <PaintAreaContextProvider value={paintAreaContext}>
                        {renderDefsElements(fillDefs)}
                        {renderDefsElements(strokeDefs)}
                    </PaintAreaContextProvider>

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
                    <text className={PaintedTextStyles.paintedTextLayer} opacity={0}>
                        {renderRuns(true)}
                    </text>
                )}

                {fillDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);

                    return renderLayer(
                        `fill-${index}`,
                        {
                            fill: paint.fill,
                            fillOpacity: paint.fillOpacity,
                            filter: paint.filter,
                            clipPath: paint.clipPath,
                            style: paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                        },
                        PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length),
                    );
                })}

                {strokeDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);

                    return renderLayer(
                        `stroke-${index}`,
                        {
                            fill: "none",
                            stroke: paint.fill,
                            strokeOpacity: paint.fillOpacity,
                            strokeWidth: strokePaint.drawnWidth,
                            strokeLinejoin: "round",
                            mask: strokePaint.maskKind ? `url(#${maskId})` : undefined,
                            filter: paint.filter,
                            clipPath: paint.clipPath,
                            style: paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                        },
                        PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length),
                    );
                })}

                {atomics.map((node, index) => {
                    const letterStyle = getLetterStyle(atomicLetterIndices[index]);

                    return (
                        <g
                            key={index}
                            style={letterStyle && toReactStyle(letterStyle)}
                            ref={(group) => {
                                if (group && group.firstChild !== node) group.replaceChildren(node);
                            }}
                        />
                    );
                })}
            </svg>

            {caretBox && (
                <div
                    key={`${caretBox.x}-${caretBox.top}`}
                    className={PaintedTextStyles.paintedTextCaret}
                    style={{ left: `${caretBox.x}px`, top: `${caretBox.top}px`, height: `${caretBox.height}px` }}
                >
                    {driver?.renderCaret?.()}
                </div>
            )}
        </div>
    );
};
