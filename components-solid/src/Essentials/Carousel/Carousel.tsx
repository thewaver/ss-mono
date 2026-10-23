import type { Accessor } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPlacement,
    type CarouselPlacementGroup,
    type CarouselSlideState,
    CarouselUtils,
    LiveAnnouncerUtils,
    CarouselStyles as styles,
} from "@thewaver/ss-components";
import { CarouselConst } from "@thewaver/ss-components/internal";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { CarouselControls, CarouselProps } from "./CarouselSolid.types";

export const Carousel = <T,>(props: CarouselProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getViewportRef, setViewportRef] = createSignal<HTMLElement>();
    const [getSwipeRatio, setSwipeRatio] = createSignal(0);
    const [getIsGliding, setIsGliding] = createSignal(false);

    const [getIndex, setIndex] = SignalMirrorSolidUtils.createOptional(() => props.index, 0);
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        CarouselConst.NO_PROGRESS,
    );

    const faceRefs: (HTMLElement | undefined)[] = [];
    const placements: (Accessor<CarouselPlacement> | undefined)[] = [];

    const getCount = createMemo(() => access(props.slides).length);

    const getGroups = createMemo(() => CarouselUtils.resolveGroups(props.computeGroups?.(getCount()), getCount()));

    const getGroupCount = () => getGroups().length;

    const getRests = createMemo(() => getGroups().map(CarouselUtils.getGroupRest));

    const getMemberships = createMemo(() => CarouselUtils.getGroupMemberships(getGroups(), getCount()));

    const getCurrentIndex = createMemo(() => CarouselUtils.wrapIndex(getIndex(), getGroupCount()));

    const getCurrentGroup = () => getGroups()[getCurrentIndex()];

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLooping = createMemo(() => access(props.isLooping) ?? CAROUSEL_DEFAULTS.isLooping);

    const getIsWindowed = createMemo(() => access(props.isWindowed) ?? CAROUSEL_DEFAULTS.isWindowed);

    const getOrientation = createMemo(() => access(props.orientation) ?? CAROUSEL_DEFAULTS.orientation);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CAROUSEL_DEFAULTS.transitionDurationMs,
    );

    const getAutoplayDelayMs = createMemo(() => access(props.autoplayDelayMs));

    const [getIsHeldByPage, setIsHeldByPage] = createSignal(false);

    const getIsHeldWithin = InteractionTrackerSolidUtils.trackHold(getRootRef);

    const getIsHeld = createMemo(() => getIsHeldWithin() || getIsHeldByPage());

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getViewportRef);

    const getPosition = () => CarouselUtils.toGroupPosition(getProgress(), getRests(), getCount(), getIsLooping());

    const getDrawnPosition = () => getPosition() - getSwipeRatio();

    const getCopies = createMemo(() =>
        CarouselUtils.getCopyCount(getGroupCount(), props.placement.reach, getIsLooping()),
    );

    const getRingCount = () => getCount() * getCopies();

    const getRingPosition = createMemo<number | undefined>((previous) =>
        CarouselUtils.followCopies(previous, getDrawnPosition(), getCount(), getCopies()),
    );

    const getRingRests = createMemo(() =>
        Array.from({ length: getCopies() }, (_, copy) => getRests().map((rest) => rest + copy * getCount())).flat(),
    );

    const getGroupPosition = createMemo(() =>
        CarouselUtils.toGroupCoordinate(getRingPosition() ?? 0, getRingRests(), getRingCount(), getIsLooping()),
    );

    const getRingSlides = createMemo(() => {
        const slides = access(props.slides);

        return Array.from({ length: getRingCount() }, (_, place) => slides[place % slides.length]);
    });

    const getCurrentPlace = createMemo(() => {
        const group = getCurrentGroup();

        return group ? CarouselUtils.getGroupPlace(group, getRingPosition() ?? 0, getCount(), getCopies()) : 0;
    });

    const getIsCurrentPlace = (place: number) => {
        const group = getCurrentGroup();

        return (
            group !== undefined &&
            CarouselUtils.getIsInGroupPlace(place, getCurrentPlace(), group.end - group.start, getRingCount())
        );
    };

    const toIndex = (place: number) => place % Math.max(getCount(), 1);

    const getIsPressDisabled = () =>
        CarouselUtils.getIsSwipeDisabled(props.progress !== undefined, getIsDisabled(), getGroupCount());

    let stopGlide: (() => void) | undefined;
    let writtenProgress: number | undefined;

    const writeProgress = (progress: number) => {
        writtenProgress = progress;
        setProgress(progress);
    };

    const glideTo = (index: number) => {
        const count = getCount();
        const rests = getRests();
        const isLooping = getIsLooping();
        const from = getDrawnPosition();

        stopGlide?.();
        writeProgress(CarouselUtils.toGroupProgress(from, rests, count, isLooping));
        setSwipeRatio(0);
        setIsGliding(true);

        stopGlide = CarouselUtils.glide({
            from,
            to: CarouselUtils.getGlideTarget(from, rests[index] ?? 0, count, isLooping),
            durationMs: getTransitionDurationMs(),
            onFrame: (position) => writeProgress(CarouselUtils.toGroupProgress(position, rests, count, isLooping)),
            onEnd: () => setIsGliding(false),
        });
    };

    onCleanup(() => stopGlide?.());

    const goTo = (index: number) => {
        const next = CarouselUtils.resolveIndex(index, getGroupCount(), getIsLooping());

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
                          getGroupCount(),
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
            count: getGroupCount(),
        }),
    );

    const getSlideLabel = (index: number) => props.computeSlideLabel(index, getCount());

    const getAnnouncement = (index: number) => {
        const group = getGroups()[index];

        if (!group || !props.computeGroupLabel) return getSlideLabel(index);

        return props.computeGroupLabel(group.start, group.end, getCount());
    };

    const getSlideRoleDescription = () => access(props.slideRoleDescription) ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const getDistance = (place: number) =>
        CarouselUtils.getDistance(place, getRingPosition() ?? 0, getRingCount(), getIsLooping());

    const getPlacementGroup = (place: number): CarouselPlacementGroup =>
        props.computeGroups === undefined
            ? CarouselUtils.toSlideGroup(getDistance(place), place, getRingCount())
            : CarouselUtils.getPlacementGroup({
                  place,
                  groupPosition: getGroupPosition(),
                  memberships: getMemberships(),
                  rests: getRingRests(),
                  count: getCount(),
                  groupCount: getGroupCount(),
                  copies: getCopies(),
                  isLooping: getIsLooping(),
              });

    const getSlideState = (place: number, face: CarouselFace): CarouselSlideState => ({
        index: toIndex(place),
        count: getCount(),
        distance: getDistance(place),
        face,
        isCurrent: getIsCurrentPlace(place),
    });

    createEffect(
        on(getCurrentIndex, (index, previous) => {
            const position = untrack(getPosition);
            const rests = untrack(getRests);
            const isThere =
                CarouselUtils.getNearestGroup(position, rests, untrack(getCount), untrack(getIsLooping)) === index;

            if (previous === undefined) {
                if (!isThere) {
                    writeProgress(
                        CarouselUtils.toGroupProgress(
                            rests[index] ?? 0,
                            rests,
                            untrack(getCount),
                            untrack(getIsLooping),
                        ),
                    );
                }

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

                const rests = untrack(getRests);
                const nearest = CarouselUtils.getNearestGroup(
                    CarouselUtils.toGroupPosition(progress, rests, untrack(getCount), untrack(getIsLooping)),
                    rests,
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
            LiveAnnouncerUtils.announce(getAnnouncement(index));
        }

        return index;
    });

    createEffect(() => {
        const isAtEnd = CarouselUtils.getIsPlaybackAtEnd({
            isLooping: getIsLooping(),
            autoplayDelayMs: getAutoplayDelayMs(),
            isPlaying: getIsPlaying(),
            isDisabled: getIsDisabled(),
            count: getGroupCount(),
            index: getCurrentIndex(),
        });

        if (isAtEnd) setIsPlaying(false);
    });

    const handleViewportClick = (e: MouseEvent) => {
        if (getIsPressDisabled()) return;

        const getDrawn = (place: number) => faceRefs[place]?.firstElementChild ?? faceRefs[place];

        if (faceRefs.some((_face, place) => getIsCurrentPlace(place) && getDrawn(place)?.contains(e.target as Node))) {
            return;
        }

        const rects = faceRefs.map((_face, place) =>
            !getIsCurrentPlace(place) && placements[place]?.().effect.opacity !== CarouselConst.HIDDEN_OPACITY
                ? getDrawn(place)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit === undefined) return;

        const group = CarouselUtils.getNearestGroupHolding(
            toIndex(hit),
            getGroups(),
            getPosition(),
            getCount(),
            getIsLooping(),
        );

        if (group !== undefined) goTo(group);
    };

    const renderSlideAt = (getSlide: Accessor<T>, place: number, getGroup: Accessor<CarouselPlacementGroup>) => {
        const getPlacement = createMemo(() =>
            props.placement.place({
                distance: getDistance(place),
                group: getGroup(),
                index: place,
                count: getRingCount(),
                size: getSize(),
                orientation: getOrientation(),
                isLooping: getIsLooping(),
            }),
        );

        const getIsCurrent = () => getIsCurrentPlace(place);

        placements[place] = getPlacement;

        onCleanup(() => {
            faceRefs[place] = undefined;
            placements[place] = undefined;
        });

        return (
            <div
                class={styles.carouselSlide}
                style={CarouselUtils.toSlideStyle(getPlacement(), getDistance(place))}
                role="group"
                aria-roledescription={getSlideRoleDescription()}
                aria-label={getSlideLabel(toIndex(place))}
                aria-hidden={!getIsCurrent() || undefined}
                inert={!getIsCurrent()}
            >
                <div
                    ref={(element) => {
                        faceRefs[place] = element;
                    }}
                    class={styles.carouselFace}
                    classList={{ [styles.carouselFaceTurnable]: props.renderSlideBack !== undefined }}
                >
                    {props.renderSlide(getSlide, () => getSlideState(place, "front"))}
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
                            {getRenderSlideBack()(getSlide, () => getSlideState(place, "back"))}
                        </div>
                    )}
                </Show>
            </div>
        );
    };

    const controls: CarouselControls = {
        getIndex: getCurrentIndex,
        getCount: getGroupCount,
        getIsPlaying,
        getIsHeld,
        getCanStep: (step) =>
            !CarouselUtils.getIsStepDisabled(step, getCurrentIndex(), getGroupCount(), getIsLooping(), getIsDisabled()),
        step: (step) => {
            if (
                CarouselUtils.getIsStepDisabled(
                    step,
                    getCurrentIndex(),
                    getGroupCount(),
                    getIsLooping(),
                    getIsDisabled(),
                )
            ) {
                return false;
            }

            goTo(CarouselUtils.getStepTarget(step, getCurrentIndex(), getGroupCount(), getIsLooping()));

            return true;
        },
        pick: (index) => {
            if (getIsDisabled() || index < 0 || index >= getGroupCount() || index === getCurrentIndex()) return false;

            goTo(index);

            return true;
        },
        setIsPlaying: (isPlaying) => {
            if (getIsDisabled() || isPlaying === getIsPlaying()) return false;

            setIsPlaying(isPlaying);

            return true;
        },
        setIsHeldByPage: (isHeld) => {
            if (isHeld === untrack(getIsHeldByPage)) return false;

            setIsHeldByPage(isHeld);

            return true;
        },
    };

    onMount(() => props.onMount?.(controls));

    return (
        <div
            ref={setRootRef}
            class={styles.carouselRoot}
            role="region"
            aria-roledescription={access(props.roleDescription) ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <div ref={setViewportRef} class={styles.carouselViewport} onClick={handleViewportClick}>
                <Index each={getRingSlides()}>
                    {(getSlide, place) => {
                        const getGroup = createMemo(() => getPlacementGroup(place));

                        const getIsBuiltHere = createMemo(() =>
                            CarouselUtils.getIsBuilt(getGroup().distance, props.placement.reach, getIsWindowed()),
                        );

                        return <Show when={getIsBuiltHere()}>{renderSlideAt(getSlide, place, getGroup)}</Show>;
                    }}
                </Index>
            </div>
        </div>
    );
};
