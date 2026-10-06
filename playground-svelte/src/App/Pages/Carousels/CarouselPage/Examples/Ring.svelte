<script lang="ts">
    import { untrack } from "svelte";

    import {
        Button,
        Carousel,
        CarouselPlacementUtils,
        MediaQueryMonitorSvelteUtils,
    } from "@thewaver/ss-components-svelte";
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";

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

    <Button
        id={"ringTurn"}
        ariaLabel={isTurning ? "Stop" : "Turn"}
        onClick={() => {
            isTurning = !isTurning;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={isTurning ? CONTROL_GLYPHS.stop : CONTROL_GLYPHS.play} />
        {/snippet}
    </Button>
</div>
