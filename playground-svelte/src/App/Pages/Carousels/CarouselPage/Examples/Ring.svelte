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
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";

    const TILT_DEGREES = 18;

    type Props = Pick<CarouselExampleProps, "slides" | "index" | "isDisabled" | "orientation">;

    const computeRingPlacement = CarouselPlacementUtils.createPaddleWheel({
        perspectivePx: CarouselKnobs.RING_PERSPECTIVE_PX,
    });

    let { index = $bindable(), ...props }: Props = $props();

    let progress = $state(0);

    const frameClasses = $derived(styles.ringFrames[props.orientation]);

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
    <Tilter maxTiltDegrees={TILT_DEGREES}>
        <div class={styles.ringFrame}>
            <div class={styles.ringSlot}>
                <Carousel
                    computePlacement={computeRingPlacement}
                    slides={props.slides}
                    bind:index
                    bind:progress
                    isDisabled={props.isDisabled}
                    orientation={props.orientation}
                    ariaLabel={"Turning ring"}
                    computeSlideLabel={computePositionLabel}
                    computeStepLabel={computeCarouselStepLabel}
                    computeRotationLabel={computeCarouselRotationLabel}
                >
                    {#snippet renderSlide(slide, state)}
                        <div class={frameClasses.front}>
                            <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
                        </div>
                    {/snippet}

                    {#snippet renderSlideBack(slide, state)}
                        <div class={frameClasses.back}>
                            <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
                        </div>
                    {/snippet}
                </Carousel>
            </div>
        </div>
    </Tilter>

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
