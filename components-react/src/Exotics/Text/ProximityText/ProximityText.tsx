import {
    type CSSProperties,
    Fragment,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterSegment,
    type LetterState,
    PROXIMITY_TEXT_DEFAULTS,
    ProximityTextStyles,
    ProximityTextUtils,
    ViewportUtils,
} from "@thewaver/ss-components";
import { type Rect, StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriver.context.types";
import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useLatest, useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ProximityTextProps } from "./ProximityText.types";

const RESTING_STRENGTH = 0;
const NO_TIME = 0;
const CUSTOM_PROPERTY_PREFIX = "--";
const DATA_PREFIX = "data-";
const EMPTY_BOX: Rect = { x: 0, y: 0, width: 0, height: 0 };

const toReactStyle = (style: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            key.startsWith(CUSTOM_PROPERTY_PREFIX) ? key : StringUtils.kebabToCamelCase(key),
            value,
        ]),
    ) as CSSProperties;

const toDataAttributes = (dataset: DOMStringMap) =>
    Object.fromEntries(
        Object.entries(dataset).map(([key, value]) => [`${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`, value]),
    );

const getIsSameBoxes = (a: readonly Rect[], b: readonly Rect[]) =>
    a.length === b.length &&
    a.every(
        (box, index) =>
            box.x === b[index].x &&
            box.y === b[index].y &&
            box.width === b[index].width &&
            box.height === b[index].height,
    );

export const ProximityText = (props: ProximityTextProps) => {
    const viewportContext = useViewportContext();

    const computeAnimationName = props.computeAnimationName ?? PROXIMITY_TEXT_DEFAULTS.computeAnimationName;
    const reachPx = props.reachPx ?? PROXIMITY_TEXT_DEFAULTS.reachPx;
    const isDisabled = props.isDisabled ?? false;
    const distanceAxis = props.distanceAxis ?? PROXIMITY_TEXT_DEFAULTS.distanceAxis;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const restLetterRefs = useRef<(HTMLElement | null)[]>([]);
    const [restElement, setRestElement] = useState<HTMLDivElement | null>(null);
    const [restBoxes, setRestBoxes] = useState<Rect[]>([]);

    const [registry] = useState(LetterDriverUtils.createRegistry);
    const registryState = useStore(registry);
    const isDriven = registryState.entries.length > 0;

    const latest = useLatest({ computeAnimationName, isDriven });

    const [layout] = useState(() =>
        ProximityTextUtils.createLayout({
            getContainer: () => containerRef.current ?? undefined,
            getComputeAnimationName: () => latest.current.computeAnimationName,
            getIsDriven: () => latest.current.isDriven,
        }),
    );

    const state = useStore(layout);

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        rootRef,
        isDisabled,
        props.pointSource,
    );

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const characters = useMemo(
        () => (isDriven ? registryState.characters : LetterDriverUtils.getCharacters(state.segments)),
        [isDriven, registryState.characters, state.segments],
    );

    const animationNames = useStableList(
        characters.map((character, index) => computeAnimationName(character, index, characters.length)),
    );

    const drivenBoxes = useMemo(() => {
        const root = rootRef.current;

        if (!root) return [];

        const rootRect = ViewportUtils.getAdjustedBoundingClientRect(root, viewportContext);

        return registryState.entries.flatMap((entry) => {
            const entryRect = ViewportUtils.getAdjustedBoundingClientRect(entry.element, viewportContext);
            const dx = entryRect.x - rootRect.x;
            const dy = entryRect.y - rootRect.y;

            return entry.boxes.map((box) => ({ ...box, x: box.x + dx, y: box.y + dy }));
        });
    }, [registryState.entries, size.width, size.height, viewportContext]);

    const strengths = ProximityTextUtils.computeStrengths(
        isDriven ? drivenBoxes : restBoxes,
        ProximityTextUtils.toPoint(reading, isPointerPresent && !isDisabled, size),
        reachPx,
        distanceAxis,
    );

    const getLetterAnimation = (index: number, isResting: boolean) =>
        ProximityTextUtils.toLetterAnimation(
            animationNames[index],
            isResting ? RESTING_STRENGTH : (strengths[index] ?? RESTING_STRENGTH),
        );

    const getLetterStyle = (index: number, isResting: boolean) =>
        toReactStyle(
            LetterDriverUtils.computeAnimationStyle(
                getLetterAnimation(index, isResting),
                LetterDriverStyles.letterDriverTimeVar,
            ),
        );

    const measureRest = () => {
        const boxes = restLetterRefs.current
            .slice(0, LetterDriverUtils.getCharacters(layout.get().segments).length)
            .map((element) =>
                element
                    ? {
                          x: element.offsetLeft,
                          y: element.offsetTop,
                          width: element.offsetWidth,
                          height: element.offsetHeight,
                      }
                    : EMPTY_BOX,
            );

        setRestBoxes((previous) => (getIsSameBoxes(previous, boxes) ? previous : boxes));
    };

    const measureRestRef = useLatest(measureRest);

    useEffect(() => {
        if (!restElement) return;

        const observer = new ResizeObserver(() => measureRestRef.current());

        observer.observe(restElement);

        return () => observer.disconnect();
    }, [restElement, measureRestRef]);

    useLayoutEffect(() => {
        measureRest();
    }, [state.segments]);

    const namedRef = useRef({ characters, animationNames });

    useEffect(() => {
        const named = namedRef.current;

        namedRef.current = { characters, animationNames };

        if (named.characters === characters && named.animationNames !== animationNames) layout.update(true);
    }, [animationNames]);

    useEffect(() => {
        const container = containerRef.current;

        return container ? layout.observe(container) : undefined;
    }, [layout]);

    const getLetterState = (index: number): LetterState => ({
        isHidden: false,
        animation: getLetterAnimation(index, false),
    });

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        isAnimating: true,
        isHidden: false,
        computePushingAnimationName: computeAnimationName,
    };

    const renderSegment = (segment: LetterSegment, isResting: boolean): ReactNode => {
        switch (segment.type) {
            case "atomic":
                return (
                    <span
                        ref={(node) => {
                            if (isResting) {
                                restLetterRefs.current[segment.startIndex] = node;
                            } else if (node && node.firstChild !== segment.element) {
                                node.replaceChildren(segment.element);
                            }
                        }}
                        className={
                            segment.isBlockLike
                                ? ProximityTextStyles.proximityTextBlockLikeAtomic
                                : ProximityTextStyles.proximityTextLetter
                        }
                        style={{
                            ...getLetterStyle(segment.startIndex, isResting),
                            ...(isResting ? { width: `${segment.width}px`, height: `${segment.height}px` } : {}),
                        }}
                    />
                );
            case "linebreak":
                return (
                    <br
                        ref={(node) => {
                            if (isResting && LetterDriverUtils.getIsAnimated(segment)) {
                                restLetterRefs.current[segment.startIndex] = node;
                            }
                        }}
                    />
                );
            case "text": {
                const letters = Array.from(segment.text).map((character, offset) => (
                    <span
                        key={offset}
                        ref={(node) => {
                            if (isResting) restLetterRefs.current[segment.startIndex + offset] = node;
                        }}
                        className={ProximityTextStyles.proximityTextLetter}
                        style={getLetterStyle(segment.startIndex + offset, isResting)}
                    >
                        {character}
                    </span>
                ));
                const style = toReactStyle({ ...segment.nonMetrics, ...segment.metrics });
                const common = {
                    title: segment.meta?.common.title,
                    ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                };

                return !isResting && segment.meta?.anchor ? (
                    <a style={style} {...common} {...segment.meta.anchor}>
                        {letters}
                    </a>
                ) : (
                    <span style={style} {...(isResting ? {} : common)}>
                        {letters}
                    </span>
                );
            }
        }
    };

    return (
        <LetterDriverContextProvider value={driver}>
            <div
                ref={rootRef}
                className={ProximityTextStyles.proximityTextRoot}
                style={
                    assignInlineVars({
                        [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(NO_TIME),
                    }) as CSSProperties
                }
            >
                <div
                    ref={containerRef}
                    className={isDriven ? undefined : ProximityTextStyles.proximityTextChildrenWrap}
                    aria-hidden={isDriven ? undefined : "true"}
                    inert={!isDriven}
                >
                    {props.children}
                </div>

                {!isDriven && state.segments.length > 0 && (
                    <>
                        <div
                            className={ProximityTextStyles.proximityTextLines}
                            style={{ width: `${state.width ?? 0}px` }}
                        >
                            {state.segments.map((segment, index) => (
                                <Fragment key={index}>{renderSegment(segment, false)}</Fragment>
                            ))}
                        </div>

                        <div
                            ref={setRestElement}
                            className={ProximityTextStyles.proximityTextRestLines}
                            style={{ width: `${state.width ?? 0}px` }}
                            aria-hidden="true"
                        >
                            {state.segments.map((segment, index) => (
                                <Fragment key={index}>{renderSegment(segment, true)}</Fragment>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </LetterDriverContextProvider>
    );
};
