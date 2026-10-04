import type { Accessor, JSX } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPickRenderProps,
    type CarouselPlacement,
    type CarouselRotationFlags,
    type CarouselSlideState,
    type CarouselStep,
    type CarouselStepRenderProps,
    CarouselUtils,
    LiveAnnouncerUtils,
    CarouselStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type { CarouselControlProps, CarouselControls, CarouselProps } from "./CarouselSolid.types";

const NO_PROGRESS = 0;
const HIDDEN_OPACITY = 0;

const CarouselControl = (props: CarouselControlProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.carouselControl}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            aria-current={access(props.isCurrent) || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};

export const Carousel = <T,>(props: CarouselProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getViewportRef, setViewportRef] = createSignal<HTMLElement>();
    const [getSwipeRatio, setSwipeRatio] = createSignal(0);
    const [getIsGliding, setIsGliding] = createSignal(false);

    const [getIndex, setIndex] = SignalMirrorSolidUtils.createOptional(() => props.index, 0);
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);

    const faceRefs: (HTMLElement | undefined)[] = [];
    const placements: Accessor<CarouselPlacement>[] = [];

    const getCount = createMemo(() => access(props.slides).length);

    const getCurrentIndex = createMemo(() => CarouselUtils.wrapIndex(getIndex(), getCount()));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLooping = createMemo(() => access(props.isLooping) ?? CAROUSEL_DEFAULTS.isLooping);

    const getOrientation = createMemo(() => access(props.orientation) ?? CAROUSEL_DEFAULTS.orientation);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CAROUSEL_DEFAULTS.transitionDurationMs,
    );

    const getAutoplayDelayMs = createMemo(() => access(props.autoplayDelayMs));

    const getIsHeld = InteractionTrackerSolidUtils.trackHold(getRootRef);

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getViewportRef);

    const getPosition = () => CarouselUtils.toPosition(getProgress(), getCount(), getIsLooping());

    const getDrawnPosition = () => getPosition() - getSwipeRatio();

    const getIsPressDisabled = () =>
        CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, getIsDisabled(), getCount());

    let stopGlide: (() => void) | undefined;
    let writtenProgress: number | undefined;

    const writeProgress = (progress: number) => {
        writtenProgress = progress;
        setProgress(progress);
    };

    const glideTo = (index: number) => {
        const count = getCount();
        const isLooping = getIsLooping();
        const from = getDrawnPosition();

        stopGlide?.();
        writeProgress(CarouselUtils.toProgress(from, count, isLooping));
        setSwipeRatio(0);
        setIsGliding(true);

        stopGlide = CarouselUtils.glide({
            from,
            to: CarouselUtils.getGlideTarget(from, index, count, isLooping),
            durationMs: getTransitionDurationMs(),
            onFrame: (position) => writeProgress(CarouselUtils.toProgress(position, count, isLooping)),
            onEnd: () => setIsGliding(false),
        });
    };

    onCleanup(() => stopGlide?.());

    const goTo = (index: number) => {
        const next = CarouselUtils.resolveIndex(index, getCount(), getIsLooping());

        if (next === undefined || next === getCurrentIndex()) return;

        setIndex(next);

        void props.onIndexChange?.(next);
    };

    const { getIsSwiping } = InteractionTrackerSolidUtils.trackAxialSwipe(getViewportRef, getIsPressDisabled, {
        getAxis: () => (CarouselUtils.getTravelsAcross(getOrientation()) ? "horizontal" : "vertical"),
        getCommitRatio: () => CarouselUtils.SWIPE_COMMIT_RATIO,
        onSwipe: (progressRatio) => {
            setSwipeRatio(CarouselUtils.clampSwipeRatio(progressRatio));
        },
        onSwipeEnd: (direction) => {
            const current = getCurrentIndex();
            const target =
                direction === undefined
                    ? undefined
                    : CarouselUtils.resolveIndex(
                          current + CarouselUtils.getSwipeStep(direction),
                          getCount(),
                          getIsLooping(),
                      );

            if (target === undefined || target === current) {
                glideTo(current);

                return;
            }

            goTo(target);
        },
    });

    const getIsRotating = createMemo(() =>
        CarouselUtils.getIsRotating({
            autoplayDelayMs: getAutoplayDelayMs(),
            isPlaying: getIsPlaying(),
            isHeld: getIsHeld(),
            isSwiping: getIsSwiping(),
            isDisabled: getIsDisabled(),
            count: getCount(),
        }),
    );

    const getSlideLabel = (index: number) => props.computeSlideLabel(index, getCount());

    const getSlideRoleDescription = () => access(props.slideRoleDescription) ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const getDistance = (index: number) =>
        CarouselUtils.getDistance(index, getDrawnPosition(), getCount(), getIsLooping());

    const getSlideState = (index: number, face: CarouselFace): CarouselSlideState => ({
        index,
        count: getCount(),
        distance: getDistance(index),
        face,
        isCurrent: index === getCurrentIndex(),
    });

    createEffect(
        on(getCurrentIndex, (index, previous) => {
            const position = untrack(getPosition);
            const isThere = CarouselUtils.getNearestIndex(position, untrack(getCount), untrack(getIsLooping)) === index;

            if (previous === undefined) {
                if (!isThere) writeProgress(CarouselUtils.toProgress(index, untrack(getCount), untrack(getIsLooping)));

                return;
            }

            if (isThere && !untrack(getIsGliding)) return;

            untrack(() => glideTo(index));
        }),
    );

    createEffect(
        on(
            getProgress,
            (progress) => {
                if (untrack(getIsGliding)) {
                    if (progress === writtenProgress) return;

                    stopGlide?.();
                    setIsGliding(false);
                }

                const nearest = CarouselUtils.getNearestIndex(
                    CarouselUtils.toPosition(progress, untrack(getCount), untrack(getIsLooping)),
                    untrack(getCount),
                    untrack(getIsLooping),
                );

                if (nearest === untrack(getCurrentIndex)) return;

                setIndex(nearest);

                void props.onIndexChange?.(nearest);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const delayMs = getAutoplayDelayMs();

        if (!getIsRotating() || delayMs === undefined) return;

        const from = getCurrentIndex();
        const advance = setTimeout(() => goTo(from + 1), delayMs);

        onCleanup(() => {
            clearTimeout(advance);
        });
    });

    createEffect<number | undefined>((previous) => {
        const index = getCurrentIndex();

        if (CarouselUtils.getIsAnnounced(previous, index, getIsRotating())) {
            LiveAnnouncerUtils.announce(getSlideLabel(index));
        }

        return index;
    });

    createEffect(() => {
        const isAtEnd = CarouselUtils.getIsPlaybackAtEnd({
            isLooping: getIsLooping(),
            autoplayDelayMs: getAutoplayDelayMs(),
            isPlaying: getIsPlaying(),
            isDisabled: getIsDisabled(),
            count: getCount(),
            index: getCurrentIndex(),
        });

        if (isAtEnd) setIsPlaying(false);
    });

    const handleViewportClick = (e: MouseEvent) => {
        if (getIsPressDisabled()) return;

        const currentIndex = getCurrentIndex();
        const getDrawn = (index: number) => faceRefs[index]?.firstElementChild ?? faceRefs[index];

        if (getDrawn(currentIndex)?.contains(e.target as Node)) return;

        const rects = faceRefs.map((_face, index) =>
            index !== currentIndex && placements[index]?.().effect.opacity !== HIDDEN_OPACITY
                ? getDrawn(index)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit !== undefined) goTo(hit);
    };

    const renderStepControl = (step: CarouselStep): JSX.Element => {
        const getTargetIndex = () => CarouselUtils.getStepTarget(step, getCurrentIndex(), getCount(), getIsLooping());

        return (
            <InteractionWrapper<CarouselStepRenderProps>
                isDisabled={() =>
                    CarouselUtils.getIsStepDisabled(
                        step,
                        getCurrentIndex(),
                        getCount(),
                        getIsLooping(),
                        getIsDisabled(),
                    )
                }
                extraFlags={() => ({ step, targetIndex: getTargetIndex() })}
                renderControl={(setElementRef, getRenderProps) => (
                    <CarouselControl
                        ref={setElementRef}
                        isCurrent={false}
                        ariaLabel={() => props.computeStepLabel(step)}
                        flags={getRenderProps}
                        renderContent={() => props.renderStep?.(() => step, getRenderProps)}
                        onActivate={() => goTo(getTargetIndex())}
                    />
                )}
            />
        );
    };

    const renderPickControl = (index: number): JSX.Element => (
        <InteractionWrapper<CarouselPickRenderProps>
            isDisabled={getIsDisabled}
            extraFlags={() => ({ index, isCurrent: index === getCurrentIndex() })}
            renderControl={(setElementRef, getRenderProps) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={() => getRenderProps().isCurrent}
                    ariaLabel={() => getSlideLabel(index)}
                    flags={getRenderProps}
                    renderContent={() => props.renderPick?.(() => index, getRenderProps)}
                    onActivate={() => goTo(index)}
                />
            )}
        />
    );

    const renderRotationControl = (): JSX.Element => (
        <InteractionWrapper<CarouselRotationFlags>
            isDisabled={getIsDisabled}
            extraFlags={() => ({ isPlaying: getIsPlaying(), isHeld: getIsHeld() })}
            renderControl={(setElementRef, getFlags) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={false}
                    ariaLabel={() => props.computeRotationLabel(getIsPlaying())}
                    flags={getFlags}
                    renderContent={() => props.renderRotationControl?.(getFlags)}
                    onActivate={() => setIsPlaying((prev) => !prev)}
                />
            )}
        />
    );

    const controls: CarouselControls = {
        getIndex: getCurrentIndex,
        getCount,
        getIsPlaying,
        getIsHeld,
        renderStep: renderStepControl,
        renderPick: renderPickControl,
        renderRotationControl,
    };

    return (
        <div
            ref={setRootRef}
            class={styles.carouselRoot}
            style={{ gap: `${access(props.gap) ?? CAROUSEL_DEFAULTS.gap}px` }}
            role="region"
            aria-roledescription={access(props.roleDescription) ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <div ref={setViewportRef} class={styles.carouselViewport} onClick={handleViewportClick}>
                <Index each={access(props.slides)}>
                    {(getSlide, index) => {
                        const getPlacement = createMemo(() =>
                            props.computePlacement({
                                distance: getDistance(index),
                                index,
                                count: getCount(),
                                size: getSize(),
                                orientation: getOrientation(),
                                isLooping: getIsLooping(),
                            }),
                        );

                        const getIsCurrent = () => index === getCurrentIndex();

                        placements[index] = getPlacement;

                        onCleanup(() => {
                            faceRefs[index] = undefined;
                        });

                        return (
                            <div
                                class={styles.carouselSlide}
                                style={CarouselUtils.toSlideStyle(getPlacement(), getDistance(index))}
                                role="group"
                                aria-roledescription={getSlideRoleDescription()}
                                aria-label={getSlideLabel(index)}
                                aria-hidden={!getIsCurrent() || undefined}
                                inert={!getIsCurrent()}
                            >
                                <div
                                    ref={(element) => {
                                        faceRefs[index] = element;
                                    }}
                                    class={styles.carouselFace}
                                    classList={{ [styles.carouselFaceTurnable]: props.renderSlideBack !== undefined }}
                                >
                                    {props.renderSlide(getSlide, () => getSlideState(index, "front"))}
                                </div>

                                <Show when={props.renderSlideBack}>
                                    {(getRenderSlideBack) => (
                                        <div
                                            class={[styles.carouselFace, styles.carouselFaceTurnable].join(" ")}
                                            style={{
                                                transform: CarouselUtils.getBackTransform(
                                                    CarouselUtils.getTurnAxis(getPlacement(), getOrientation()),
                                                ),
                                            }}
                                            aria-hidden="true"
                                        >
                                            {getRenderSlideBack()(getSlide, () => getSlideState(index, "back"))}
                                        </div>
                                    )}
                                </Show>
                            </div>
                        );
                    }}
                </Index>
            </div>

            {props.renderControls?.(controls)}
        </div>
    );
};
