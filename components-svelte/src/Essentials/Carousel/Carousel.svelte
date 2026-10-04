<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CAROUSEL_DEFAULTS,
        type CarouselFace,
        type CarouselPickRenderProps,
        type CarouselRotationFlags,
        type CarouselSlideState,
        type CarouselStep,
        type CarouselStepRenderProps,
        CarouselUtils,
        type InteractionFlags,
        LiveAnnouncerUtils,
        CarouselStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { CarouselControls, CarouselProps } from "./Carousel.types.js";
    import CarouselControl from "./CarouselControl.svelte";

    const NO_PROGRESS = 0;
    const HIDDEN_OPACITY = 0;

    let {
        index = $bindable(0),
        playback = $bindable(true),
        progress = $bindable(NO_PROGRESS),
        ...props
    }: CarouselProps<T> = $props();

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    let root = $state<HTMLDivElement>();
    let viewport = $state<HTMLDivElement>();
    let swipeRatio = $state(0);
    let isGliding = $state(false);

    const faceRefs: (HTMLElement | undefined)[] = [];

    const count = $derived(props.slides.length);
    const currentIndex = $derived(CarouselUtils.wrapIndex(index, count));
    const isDisabled = $derived(props.isDisabled ?? false);
    const isLooping = $derived(props.isLooping ?? CAROUSEL_DEFAULTS.isLooping);
    const orientation = $derived(props.orientation ?? CAROUSEL_DEFAULTS.orientation);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs);
    const autoplayDelayMs = $derived(props.autoplayDelayMs);
    const slideRoleDescription = $derived(props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription);

    const getIsHeld = InteractionTrackerSvelteUtils.trackHold(() => root);

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => viewport ?? undefined);

    const position = $derived(CarouselUtils.toPosition(progress, count, isLooping));
    const drawnPosition = $derived(position - swipeRatio);
    const isPressDisabled = $derived(
        CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, isDisabled, count),
    );

    const getDistance = (slideIndex: number) =>
        CarouselUtils.getDistance(slideIndex, drawnPosition, count, isLooping);

    const placements = $derived(
        props.slides.map((_, slideIndex) =>
            props.computePlacement({
                distance: getDistance(slideIndex),
                index: slideIndex,
                count,
                size: getSize(),
                orientation,
                isLooping,
            }),
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

    const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
        index: slideIndex,
        count,
        distance: getDistance(slideIndex),
        face,
        isCurrent: slideIndex === currentIndex,
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
        () => progress,
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

        const shownIndex = currentIndex;
        const getDrawn = (slideIndex: number) => faceRefs[slideIndex]?.firstElementChild ?? faceRefs[slideIndex];

        if (getDrawn(shownIndex)?.contains(e.target as Node)) return;

        const rects = faceRefs.map((_face, slideIndex) =>
            slideIndex !== shownIndex && placements[slideIndex]?.effect.opacity !== HIDDEN_OPACITY
                ? getDrawn(slideIndex)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit !== undefined) goTo(hit);
    };

    const setStyle = (element: HTMLElement, style: Record<string, string>) => {
        for (const [name, value] of Object.entries(style)) element.style.setProperty(name, value);
    };

    const attachFace = (slideIndex: number) => (element: HTMLElement) => {
        faceRefs[slideIndex] = element;

        return () => {
            faceRefs[slideIndex] = undefined;
        };
    };

    const attachPlacement = (slideIndex: number) => (element: HTMLElement) => {
        const placement = placements[slideIndex];

        if (placement) setStyle(element, CarouselUtils.toSlideStyle(placement, getDistance(slideIndex)));
    };

    const attachBack = (slideIndex: number) => (element: HTMLElement) => {
        const placement = placements[slideIndex];

        if (!placement) return;

        setStyle(element, {
            transform: CarouselUtils.getBackTransform(CarouselUtils.getTurnAxis(placement, orientation)),
        });
    };

    const controls: CarouselControls = $derived({
        index: currentIndex,
        count,
        isPlaying: playback,
        isHeld: getIsHeld(),
        renderStep: stepControl,
        renderPick: pickControl,
        renderRotationControl: rotationControl,
    });
</script>

{#snippet stepControl(step: CarouselStep)}
    {@const targetIndex = CarouselUtils.getStepTarget(step, currentIndex, count, isLooping)}
    <InteractionWrapper
        isDisabled={CarouselUtils.getIsStepDisabled(step, currentIndex, count, isLooping, isDisabled)}
        extraFlags={{ step, targetIndex }}
    >
        {#snippet renderControl(attachElement, renderProps)}
            {#snippet stepContent(flags: InteractionFlags<CarouselStepRenderProps>)}
                {@render props.renderStep?.(step, flags)}
            {/snippet}
            <CarouselControl
                {attachElement}
                isCurrent={false}
                ariaLabel={props.computeStepLabel(step)}
                flags={renderProps}
                renderContent={stepContent}
                onActivate={() => goTo(targetIndex)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet pickControl(pickIndex: number)}
    <InteractionWrapper {isDisabled} extraFlags={{ index: pickIndex, isCurrent: pickIndex === currentIndex }}>
        {#snippet renderControl(attachElement, renderProps)}
            {#snippet pickContent(flags: InteractionFlags<CarouselPickRenderProps>)}
                {@render props.renderPick?.(pickIndex, flags)}
            {/snippet}
            <CarouselControl
                {attachElement}
                isCurrent={renderProps.isCurrent}
                ariaLabel={getSlideLabel(pickIndex)}
                flags={renderProps}
                renderContent={pickContent}
                onActivate={() => goTo(pickIndex)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet rotationControl()}
    <InteractionWrapper {isDisabled} extraFlags={{ isPlaying: playback, isHeld: getIsHeld() }}>
        {#snippet renderControl(attachElement, flags)}
            {#snippet rotationContent(contentFlags: InteractionFlags<CarouselRotationFlags>)}
                {@render props.renderRotationControl?.(contentFlags)}
            {/snippet}
            <CarouselControl
                {attachElement}
                isCurrent={false}
                ariaLabel={props.computeRotationLabel(playback)}
                {flags}
                renderContent={rotationContent}
                onActivate={() => {
                    playback = !playback;
                }}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

<div
    bind:this={root}
    class={styles.carouselRoot}
    style:gap={`${props.gap ?? CAROUSEL_DEFAULTS.gap}px`}
    role="region"
    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    <div
        bind:this={viewport}
        {@attach (element) => on(element, "click", handleViewportClick)}
        class={styles.carouselViewport}
    >
        {#each props.slides as item, slideIndex (slideIndex)}
            <div
                {@attach attachPlacement(slideIndex)}
                class={styles.carouselSlide}
                role="group"
                aria-roledescription={slideRoleDescription}
                aria-label={getSlideLabel(slideIndex)}
                aria-hidden={slideIndex !== currentIndex ? "true" : undefined}
                inert={slideIndex !== currentIndex}
            >
                <div
                    {@attach attachFace(slideIndex)}
                    class={[styles.carouselFace, props.renderSlideBack && styles.carouselFaceTurnable]}
                >
                    {@render props.renderSlide(item, getSlideState(slideIndex, "front"))}
                </div>

                {#if props.renderSlideBack}
                    <div
                        {@attach attachBack(slideIndex)}
                        class={[styles.carouselFace, styles.carouselFaceTurnable]}
                        aria-hidden="true"
                    >
                        {@render props.renderSlideBack(item, getSlideState(slideIndex, "back"))}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    {@render props.renderControls?.(controls)}
</div>
