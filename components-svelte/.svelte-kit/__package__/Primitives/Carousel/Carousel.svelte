<script lang="ts" generics="T">
    import { untrack } from "svelte";

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

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import Barrel from "../Barrel/Barrel.svelte";
    import InteractionWrapper from "../InteractionWrapper/InteractionWrapper.svelte";
    import type { CarouselControls, CarouselProps } from "./Carousel.types.js";
    import CarouselControl from "./CarouselControl.svelte";

    let { index = $bindable(0), playback = $bindable(true), ...props }: CarouselProps<T> = $props();

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    let root = $state<HTMLDivElement>();
    let viewport = $state<HTMLDivElement>();
    let swipeRatio = $state(0);

    const count = $derived(props.slides.length);
    const currentIndex = $derived(CarouselUtils.wrapIndex(index, count));
    const isDisabled = $derived(props.isDisabled ?? false);
    const isLooping = $derived(props.isLooping ?? CAROUSEL_DEFAULTS.isLooping);
    const isDrum = $derived(props.variant === "drum");
    const orientation = $derived(props.orientation ?? CAROUSEL_DEFAULTS.orientation);
    const axis = $derived(props.axis ?? CAROUSEL_DEFAULTS.axis);
    const slideSize = $derived(props.slideSize ?? CAROUSEL_DEFAULTS.slideSize);
    const travelsAcross = $derived(CarouselUtils.getTravelsAcross(isDrum, axis, orientation));
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs);
    const autoplayDelayMs = $derived(props.autoplayDelayMs);
    const slideRoleDescription = $derived(props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription);

    const getIsHeld = InteractionTrackerSvelteUtils.trackHold(() => root);

    const goTo = (target: number) => {
        const next = CarouselUtils.resolveIndex(target, count, isLooping);

        if (next === undefined || next === currentIndex) return;

        index = next;

        void props.onIndexChange?.(next);
    };

    const { getIsSwiping } = InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => viewport,
        () => CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, isDisabled, count),
        {
            getAxis: () => (travelsAcross ? "horizontal" : "vertical"),
            getCommitRatio: () => CarouselUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                swipeRatio = CarouselUtils.clampSwipeRatio(progressRatio);
            },
            onSwipeEnd: (direction) => {
                swipeRatio = 0;

                if (direction === undefined) return;

                goTo(currentIndex + CarouselUtils.getSwipeStep(direction));
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

    let lastTurn: { angle: number; index: number; count: number } | undefined;

    const turnAngle = $derived.by(() => {
        if (lastTurn && lastTurn.index === currentIndex && lastTurn.count === count) return lastTurn.angle;

        const angle = CarouselUtils.computeTurnAngle(lastTurn?.angle ?? 0, lastTurn, currentIndex, count);

        lastTurn = { angle, index: currentIndex, count };

        return angle;
    });

    const angle = $derived(CarouselUtils.getDrumAngle(turnAngle, swipeRatio, count));

    const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count);

    const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
        index: slideIndex,
        count,
        face,
        isCurrent: slideIndex === currentIndex,
    });

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

{#snippet slide(item: T, slideIndex: number, face: CarouselFace)}
    {#if face === "back"}
        {@render props.renderSlideBack?.(item, getSlideState(slideIndex, face))}
    {:else}
        {@render props.renderSlide(item, getSlideState(slideIndex, face))}
    {/if}
{/snippet}

<div
    bind:this={root}
    class={styles.carouselRoot}
    style:height={!isDrum && orientation === "vertical" ? "100%" : undefined}
    style:gap={`${props.gap ?? CAROUSEL_DEFAULTS.gap}px`}
    role="region"
    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
    aria-label={props.ariaLabel}
>
    {#if isDrum}
        <div bind:this={viewport} class={styles.carouselStage}>
            <Barrel
                faces={props.slides}
                {axis}
                faceSize={slideSize}
                {angle}
                transitionDurationMs={getIsSwiping() ? 0 : transitionDurationMs}
                faceRoleDescription={slideRoleDescription}
                computeFaceDefs={(faceIndex, face) => ({
                    ariaLabel: getSlideLabel(faceIndex),
                    isHidden: face === "back" || faceIndex !== currentIndex,
                })}
                renderFace={slide}
            />
        </div>
    {:else}
        <div bind:this={viewport} class={styles.carouselViewport}>
            <div
                class={styles.carouselTrack}
                style:flex-direction={orientation === "horizontal" ? "row" : "column"}
                style:height={orientation === "vertical" ? "100%" : undefined}
                style:transform={CarouselUtils.getTrackTransform(travelsAcross, swipeRatio, currentIndex)}
                style:transition-duration={`${getIsSwiping() ? 0 : transitionDurationMs}ms`}
            >
                {#each props.slides as item, slideIndex (slideIndex)}
                    <div
                        class={styles.carouselSlide}
                        role="group"
                        aria-roledescription={slideRoleDescription}
                        aria-label={getSlideLabel(slideIndex)}
                        aria-hidden={slideIndex !== currentIndex ? "true" : undefined}
                        inert={slideIndex !== currentIndex}
                    >
                        {@render slide(item, slideIndex, "front")}
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {@render props.renderControls?.(controls)}
</div>
