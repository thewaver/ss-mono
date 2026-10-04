<script lang="ts">
    import { untrack } from "svelte";

    import {
        Button,
        Carousel,
        CarouselPlacementUtils,
        MediaQueryMonitorSvelteUtils,
        Tilter,
    } from "@thewaver/ss-components-svelte";
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    const TILT_DEGREES = 18;

    type Props = Pick<CarouselExampleProps, "slides" | "index">;

    let { index = $bindable(), ...props }: Props = $props();

    let progress = $state(0);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let isTurning = $state(untrack(() => !getPrefersReducedMotion()));

    $effect(() => {
        if (!isTurning) return;

        let frameId: number;
        let lastMs = performance.now();

        const turn = () => {
            const nowMs = performance.now();

            progress = (progress + (nowMs - lastMs) / CarouselKnobs.RING_LAP_MS) % 1;
            lastMs = nowMs;
            frameId = requestAnimationFrame(turn);
        };

        frameId = requestAnimationFrame(turn);

        return () => cancelAnimationFrame(frameId);
    });
</script>

<div class={styles.ringStack}>
    <div class={styles.ringFrame}>
        <Tilter maxTiltDegrees={TILT_DEGREES}>
            <Carousel
                computePlacement={CarouselPlacementUtils.drum}
                slides={props.slides}
                bind:index
                bind:progress
                ariaLabel={"Turning ring"}
                computeSlideLabel={computePositionLabel}
                computeStepLabel={computeCarouselStepLabel}
                computeRotationLabel={computeCarouselRotationLabel}
            >
                {#snippet renderSlide(slide, state)}
                    <SlideFront title={slide} {state} isNarrow={false} />
                {/snippet}

                {#snippet renderSlideBack()}
                    <SlideBack isNarrow={false} />
                {/snippet}
            </Carousel>
        </Tilter>
    </div>

    <Button
        id={"ringTurn"}
        onClick={() => {
            isTurning = !isTurning;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isTurning ? "Stop" : "Turn"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
