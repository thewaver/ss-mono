import { For, Index, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";
import type { ParentProps } from "solid-js";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterSegment,
    type LetterState,
    PROXIMITY_TEXT_DEFAULTS,
    ProximityTextUtils,
    ViewportUtils,
    ProximityTextStyles as styles,
} from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriverSolid.context.types";
import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { ProximityTextProps } from "./ProximityTextSolid.types";

const RESTING_STRENGTH = 0;
const NO_TIME = 0;

export const ProximityText = (props: ParentProps<ProximityTextProps>) => {
    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();
    const [getRestRef, setRestRef] = createSignal<HTMLElement>();
    const [getRestBoxes, setRestBoxes] = createSignal<Rect[]>([]);

    const restLetterRefs: (HTMLElement | undefined)[] = [];

    const getComputeAnimationName = () => props.computeAnimationName ?? PROXIMITY_TEXT_DEFAULTS.computeAnimationName;

    const getReachPx = createMemo(() => access(props.reachPx) ?? PROXIMITY_TEXT_DEFAULTS.reachPx);

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getDistanceAxis = createMemo(() => access(props.distanceAxis) ?? PROXIMITY_TEXT_DEFAULTS.distanceAxis);

    const registry = LetterDriverUtils.createRegistry();

    const getIsDriven = accessStore(registry, (state) => state.entries.length > 0);

    const getDrivenCharacters = accessStore(registry, (state) => state.characters);

    const getDrivenEntries = accessStore(registry, (state) => state.entries);

    const layout = ProximityTextUtils.createLayout({
        getContainer: getContainerRef,
        getComputeAnimationName: () => untrack(getComputeAnimationName),
        getIsDriven,
    });

    const getSegments = accessStore(layout, (state) => state.segments);

    const getWidth = accessStore(layout, (state) => state.width);

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRootRef, getIsDisabled, () =>
        access(props.pointSource),
    );

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getCharacters = createMemo(() =>
        getIsDriven() ? getDrivenCharacters() : LetterDriverUtils.getCharacters(getSegments()),
    );

    const getAnimationNames = createMemo(() => {
        const characters = getCharacters();
        const computeAnimationName = getComputeAnimationName();

        return characters.map((character, index) => computeAnimationName(character, index, characters.length));
    });

    const getDrivenBoxes = createMemo(() => {
        const root = getRootRef();

        getSize();

        if (!root) return [];

        const rootRect = ViewportUtils.getAdjustedBoundingClientRect(root, viewportContext);

        return getDrivenEntries().flatMap((entry) => {
            const entryRect = ViewportUtils.getAdjustedBoundingClientRect(entry.element, viewportContext);
            const dx = entryRect.x - rootRect.x;
            const dy = entryRect.y - rootRect.y;

            return entry.boxes.map((box) => ({ ...box, x: box.x + dx, y: box.y + dy }));
        });
    });

    const getStrengths = createMemo(() =>
        ProximityTextUtils.computeStrengths(
            getIsDriven() ? getDrivenBoxes() : getRestBoxes(),
            ProximityTextUtils.toPoint(getReading(), getIsPointerPresent() && !getIsDisabled(), getSize()),
            getReachPx(),
            getDistanceAxis(),
        ),
    );

    const getLetterStyle = (index: number, isResting: boolean) =>
        LetterDriverUtils.computeAnimationStyle(
            ProximityTextUtils.toLetterAnimation(
                getAnimationNames()[index],
                isResting ? RESTING_STRENGTH : (getStrengths()[index] ?? RESTING_STRENGTH),
            ),
            LetterDriverStyles.letterDriverTimeVar,
        );

    const measureRest = () => {
        const boxes = restLetterRefs.slice(0, untrack(getCharacters).length).map((element) =>
            element
                ? {
                      x: element.offsetLeft,
                      y: element.offsetTop,
                      width: element.offsetWidth,
                      height: element.offsetHeight,
                  }
                : { x: 0, y: 0, width: 0, height: 0 },
        );

        setRestBoxes(boxes);
    };

    createEffect(() => {
        const rest = getRestRef();

        if (!rest) return;

        const observer = new ResizeObserver(measureRest);

        observer.observe(rest);

        onCleanup(() => observer.disconnect());
    });

    createEffect(on(getSegments, () => queueMicrotask(measureRest), { defer: true }));

    createEffect(on(getComputeAnimationName, () => layout.update(true), { defer: true }));

    const getLetterState = (index: number): LetterState => ({
        isHidden: false,
        animation: ProximityTextUtils.toLetterAnimation(
            getAnimationNames()[index],
            getStrengths()[index] ?? RESTING_STRENGTH,
        ),
    });

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        getIsAnimating: () => true,
        getIsHidden: () => false,
        getComputePushingAnimationName: getComputeAnimationName,
    };

    onMount(() => {
        const containerRef = getContainerRef();

        if (!containerRef) return;

        onCleanup(layout.observe(containerRef));
    });

    const renderSegment = (segment: LetterSegment, isResting: boolean) => {
        switch (segment.type) {
            case "atomic":
                return (
                    <span
                        ref={(element) => {
                            if (isResting) restLetterRefs[segment.startIndex] = element;
                        }}
                        class={segment.isBlockLike ? styles.proximityTextBlockLikeAtomic : styles.proximityTextLetter}
                        style={{
                            ...getLetterStyle(segment.startIndex, isResting),
                            ...(isResting ? { width: `${segment.width}px`, height: `${segment.height}px` } : {}),
                        }}
                    >
                        {isResting ? undefined : segment.element}
                    </span>
                );
            case "linebreak":
                return (
                    <br
                        ref={(element) => {
                            if (isResting && LetterDriverUtils.getIsAnimated(segment)) {
                                restLetterRefs[segment.startIndex] = element;
                            }
                        }}
                    />
                );
            case "text": {
                const renderLetters = () => (
                    <Index each={Array.from(segment.text)}>
                        {(getCharacter, charIndex) => (
                            <span
                                ref={(element) => {
                                    if (isResting) restLetterRefs[segment.startIndex + charIndex] = element;
                                }}
                                class={styles.proximityTextLetter}
                                style={getLetterStyle(segment.startIndex + charIndex, isResting)}
                            >
                                {getCharacter()}
                            </span>
                        )}
                    </Index>
                );
                const style = { ...segment.nonMetrics, ...segment.metrics };

                return !isResting && segment.meta?.anchor ? (
                    <a style={style} {...segment.meta?.common} {...segment.meta?.anchor}>
                        {renderLetters()}
                    </a>
                ) : (
                    <span style={style} {...(isResting ? {} : segment.meta?.common)}>
                        {renderLetters()}
                    </span>
                );
            }
        }
    };

    return (
        <LetterDriverContextProvider value={driver}>
            <div
                ref={setRootRef}
                class={styles.proximityTextRoot}
                style={assignInlineVars({
                    [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(NO_TIME),
                })}
            >
                <div
                    ref={setContainerRef}
                    class={getIsDriven() ? undefined : styles.proximityTextChildrenWrap}
                    aria-hidden={getIsDriven() ? undefined : "true"}
                    inert={getIsDriven() ? undefined : true}
                >
                    {props.children}
                </div>

                {!getIsDriven() && !!getSegments().length && (
                    <>
                        <div class={styles.proximityTextLines} style={{ width: `${getWidth() ?? 0}px` }}>
                            <For each={getSegments()}>{(segment) => renderSegment(segment, false)}</For>
                        </div>

                        <div
                            ref={setRestRef}
                            class={styles.proximityTextRestLines}
                            style={{ width: `${getWidth() ?? 0}px` }}
                            aria-hidden="true"
                        >
                            <For each={getSegments()}>{(segment) => renderSegment(segment, true)}</For>
                        </div>
                    </>
                )}
            </div>
        </LetterDriverContextProvider>
    );
};
