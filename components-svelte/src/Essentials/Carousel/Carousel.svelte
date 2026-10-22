<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CAROUSEL_DEFAULTS,
        type CarouselFace,
        type CarouselSlideState,
        CarouselUtils,
        LiveAnnouncerUtils,
        CarouselStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { CarouselControls, CarouselProps } from "./Carousel.types.js";

    const NO_PROGRESS = 0;
    const HIDDEN_OPACITY = 0;

    let {
        index = $bindable(0),
        playback = $bindable(true),
        progress = $bindable(),
        ...props
    }: CarouselProps<T> = $props();

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    let root = $state<HTMLDivElement>();
    let viewport = $state<HTMLDivElement>();
    let swipeRatio = $state(0);
    let isGliding = $state(false);

    const isDrivenFromOutside = untrack(() => progress !== undefined);

    const faceRefs: (HTMLElement | undefined)[] = [];

    const count = $derived(props.slides.length);
    const currentIndex = $derived(CarouselUtils.wrapIndex(index, count));
    const isDisabled = $derived(props.isDisabled ?? false);
    const isLooping = $derived(props.isLooping ?? CAROUSEL_DEFAULTS.isLooping);
    const isWindowed = $derived(props.isWindowed ?? CAROUSEL_DEFAULTS.isWindowed);
    const orientation = $derived(props.orientation ?? CAROUSEL_DEFAULTS.orientation);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs);
    const autoplayDelayMs = $derived(props.autoplayDelayMs);
    const slideRoleDescription = $derived(props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription);

    let isHeldByPage = $state(false);

    const getIsHeldWithin = InteractionTrackerSvelteUtils.trackHold(() => root);

    const getIsHeld = () => getIsHeldWithin() || isHeldByPage;

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => viewport ?? undefined);

    const position = $derived(CarouselUtils.toPosition(progress ?? NO_PROGRESS, count, isLooping));
    const drawnPosition = $derived(position - swipeRatio);
    const isPressDisabled = $derived(CarouselUtils.getIsSwipeDisabled(isDrivenFromOutside, isDisabled, count));

    const copies = $derived(CarouselUtils.getCopyCount(count, props.placement.reach, isLooping));
    const ringCount = $derived(count * copies);
    const ringPlaces = $derived(Array.from({ length: ringCount }, (_, place) => place));

    let followedRing: number | undefined;

    const ringPosition = $derived.by(() => {
        followedRing = CarouselUtils.followCopies(followedRing, drawnPosition, count, copies);

        return followedRing;
    });

    const currentPlace = $derived(CarouselUtils.getNearestCopy(currentIndex, ringPosition, count, copies));

    const toIndex = (place: number) => place % Math.max(count, 1);

    const getDistance = (place: number) => CarouselUtils.getDistance(place, ringPosition, ringCount, isLooping);

    const getIsBuiltAt = (place: number) =>
        CarouselUtils.getIsBuilt(getDistance(place), props.placement.reach, isWindowed);

    const builtPlaces = $derived(ringPlaces.filter(getIsBuiltAt));

    const placements = $derived(
        ringPlaces.map((place) =>
            getIsBuiltAt(place)
                ? props.placement.place({
                      distance: getDistance(place),
                      index: place,
                      count: ringCount,
                      size: getSize(),
                      orientation,
                      isLooping,
                  })
                : undefined,
        ),
    );

    let stopGlide: (() => void) | undefined;
    let writtenProgress: number | undefined;

    const writeProgress = (next: number) => {
        writtenProgress = next;
        progress = next;
    };

    const glideTo = (target: number) => {
        const from = drawnPosition;
        const glideCount = count;
        const glideIsLooping = isLooping;

        stopGlide?.();
        writeProgress(CarouselUtils.toProgress(from, glideCount, glideIsLooping));
        swipeRatio = 0;
        isGliding = true;

        stopGlide = CarouselUtils.glide({
            from,
            to: CarouselUtils.getGlideTarget(from, target, glideCount, glideIsLooping),
            durationMs: transitionDurationMs,
            onFrame: (next) => writeProgress(CarouselUtils.toProgress(next, glideCount, glideIsLooping)),
            onEnd: () => {
                isGliding = false;
            },
        });
    };

    $effect(() => () => stopGlide?.());

    const goTo = (target: number) => {
        const next = CarouselUtils.resolveIndex(target, count, isLooping);

        if (next === undefined || next === currentIndex) return;

        index = next;

        void props.onIndexChange?.(next);
    };

    const { getIsSwiping } = InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => viewport,
        () => isPressDisabled,
        {
            getAxis: () => (CarouselUtils.getTravelsAcross(orientation) ? "horizontal" : "vertical"),
            getCommitRatio: () => CarouselUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                swipeRatio = CarouselUtils.clampSwipeRatio(progressRatio);
            },
            onSwipeEnd: (direction) => {
                const current = currentIndex;
                const target =
                    direction === undefined
                        ? undefined
                        : CarouselUtils.resolveIndex(current + CarouselUtils.getSwipeStep(direction), count, isLooping);

                if (target === undefined || target === current) {
                    glideTo(current);

                    return;
                }

                goTo(target);
            },
        },
    );

    const isRotating = $derived(
        CarouselUtils.getIsRotating({
            autoplayDelayMs,
            isPlaying: playback,
            isHeld: getIsHeld(),
            isSwiping: getIsSwiping(),
            isDisabled,
            count,
        }),
    );

    const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count);

    const getSlideState = (place: number, face: CarouselFace): CarouselSlideState => ({
        index: toIndex(place),
        count,
        distance: getDistance(place),
        face,
        isCurrent: place === currentPlace,
    });

    let placedIndex: number | undefined;

    $effect(() => {
        const target = currentIndex;

        untrack(() => {
            const previous = placedIndex;
            const isThere = CarouselUtils.getNearestIndex(position, count, isLooping) === target;

            placedIndex = target;

            if (previous === undefined) {
                if (!isThere) writeProgress(CarouselUtils.toProgress(target, count, isLooping));

                return;
            }

            if (isThere && !isGliding) return;

            glideTo(target);
        });
    });

    watchChange(
        () => progress ?? NO_PROGRESS,
        (next) => {
            if (isGliding) {
                if (next === writtenProgress) return;

                stopGlide?.();
                isGliding = false;
            }

            const nearest = CarouselUtils.getNearestIndex(
                CarouselUtils.toPosition(next, count, isLooping),
                count,
                isLooping,
            );

            if (nearest === currentIndex) return;

            index = nearest;

            void props.onIndexChange?.(nearest);
        },
    );

    $effect(() => {
        if (!isRotating || autoplayDelayMs === undefined) return;

        const target = currentIndex + 1;
        const advance = setTimeout(() => goTo(target), autoplayDelayMs);

        return () => {
            clearTimeout(advance);
        };
    });

    let announcedIndex: number | undefined;

    $effect(() => {
        const shownIndex = currentIndex;

        untrack(() => {
            if (CarouselUtils.getIsAnnounced(announcedIndex, shownIndex, isRotating)) {
                LiveAnnouncerUtils.announce(props.computeSlideLabel(shownIndex, count));
            }
        });

        announcedIndex = shownIndex;
    });

    const isPlaybackAtEnd = $derived(
        CarouselUtils.getIsPlaybackAtEnd({
            isLooping,
            autoplayDelayMs,
            isPlaying: playback,
            isDisabled,
            count,
            index: currentIndex,
        }),
    );

    $effect(() => {
        if (isPlaybackAtEnd) playback = false;
    });

    const handleViewportClick = (e: MouseEvent) => {
        if (isPressDisabled) return;

        const shownPlace = currentPlace;
        const getDrawn = (place: number) => faceRefs[place]?.firstElementChild ?? faceRefs[place];

        if (getDrawn(shownPlace)?.contains(e.target as Node)) return;

        const rects = faceRefs.map((_face, place) =>
            place !== shownPlace && placements[place]?.effect.opacity !== HIDDEN_OPACITY
                ? getDrawn(place)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit !== undefined) goTo(toIndex(hit));
    };

    const setStyle = (element: HTMLElement, style: Record<string, string>) => {
        for (const [name, value] of Object.entries(style)) element.style.setProperty(name, value);
    };

    const attachFace = (place: number) => (element: HTMLElement) => {
        faceRefs[place] = element;

        return () => {
            faceRefs[place] = undefined;
        };
    };

    const attachPlacement = (place: number) => (element: HTMLElement) => {
        const placement = placements[place];

        if (placement) setStyle(element, CarouselUtils.toSlideStyle(placement, getDistance(place)));
    };

    const attachBack = (place: number) => (element: HTMLElement) => {
        const placement = placements[place];

        if (!placement) return;

        setStyle(element, {
            transform: CarouselUtils.getBackTransform(CarouselUtils.getTurnAxis(placement, orientation)),
        });
    };

    const controls: CarouselControls = {
        getIndex: () => currentIndex,
        getCount: () => count,
        getIsPlaying: () => playback,
        getIsHeld,
        getCanStep: (step) => !CarouselUtils.getIsStepDisabled(step, currentIndex, count, isLooping, isDisabled),
        step: (step) => {
            if (CarouselUtils.getIsStepDisabled(step, currentIndex, count, isLooping, isDisabled)) return false;

            goTo(CarouselUtils.getStepTarget(step, currentIndex, count, isLooping));

            return true;
        },
        pick: (pickIndex) => {
            if (isDisabled || pickIndex < 0 || pickIndex >= count || pickIndex === currentIndex) return false;

            goTo(pickIndex);

            return true;
        },
        setIsPlaying: (isPlaying) => {
            if (isDisabled || isPlaying === playback) return false;

            playback = isPlaying;

            return true;
        },
        setIsHeldByPage: (isHeld) => {
            if (isHeld === untrack(() => isHeldByPage)) return false;

            isHeldByPage = isHeld;

            return true;
        },
    };

    $effect(() => untrack(() => props.onMount?.(controls)));
</script>

<div
    bind:this={root}
    class={styles.carouselRoot}
    role="region"
    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    <div
        bind:this={viewport}
        {@attach (element) => on(element, "click", handleViewportClick)}
        class={styles.carouselViewport}
    >
        {#each builtPlaces as place (place)}
            {@const item = props.slides[toIndex(place)]}
            <div
                {@attach attachPlacement(place)}
                class={styles.carouselSlide}
                role="group"
                aria-roledescription={slideRoleDescription}
                aria-label={getSlideLabel(toIndex(place))}
                aria-hidden={place !== currentPlace ? "true" : undefined}
                inert={place !== currentPlace}
            >
                <div
                    {@attach attachFace(place)}
                    class={[styles.carouselFace, props.renderSlideBack && styles.carouselFaceTurnable]}
                >
                    {@render props.renderSlide(item, getSlideState(place, "front"))}
                </div>

                {#if props.renderSlideBack}
                    <div
                        {@attach attachBack(place)}
                        class={[styles.carouselFace, styles.carouselFaceTurnable]}
                        aria-hidden="true"
                    >
                        {@render props.renderSlideBack(item, getSlideState(place, "back"))}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
