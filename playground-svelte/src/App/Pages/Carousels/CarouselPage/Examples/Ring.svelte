<script lang="ts">
    import { untrack } from "svelte";

    import { Button, Carousel, MediaQueryMonitorSvelteUtils, Tilter } from "@thewaver/ss-components-svelte";
    import type { CarouselPlacementFn } from "@thewaver/ss-components-svelte";
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
    const FULL_TURN_DEGREES = 360;
    const HALF_TURN_DEGREES = 180;
    const PERCENT = 100;

    type Props = Pick<CarouselExampleProps, "slides" | "index" | "isDisabled" | "orientation">;

    const computeRingPlacement: CarouselPlacementFn = (defs) => {
        const along = defs.orientation === "horizontal" ? defs.size.width : defs.size.height;
        const angle = (defs.distance * FULL_TURN_DEGREES) / Math.max(defs.count, 1);
        const radians = (angle * Math.PI) / HALF_TURN_DEGREES;
        const radius = along * CarouselKnobs.RING_RADIUS_RATIO;
        const alongPercent = along > 0 ? ((radius * Math.sin(radians)) / along) * PERCENT : 0;
        const depth = radius * (Math.cos(radians) - 1);

        return {
            effect: {
                perspective: CarouselKnobs.RING_PERSPECTIVE_PX,
                translate3d: defs.orientation === "horizontal" ? [alongPercent, 0, depth] : [0, alongPercent, depth],
                ...(defs.orientation === "horizontal" ? { rotateY: angle } : { rotateX: -angle }),
            },
            layer: Math.cos(radians),
        };
    };

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
    <Tilter maxTiltDegrees={TILT_DEGREES}>
        <div class={[styles.ringFrame, props.orientation === "vertical" && styles.ringFrameVertical]}>
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
                        <SlideFront title={slide} {state} isNarrow={false} />
                    {/snippet}

                    {#snippet renderSlideBack()}
                        <SlideBack isNarrow={false} />
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
