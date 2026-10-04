<script lang="ts">
    import { Carousel, ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    type Props = Omit<CarouselExampleProps, "isLooping">;

    let { index = $bindable(), ...props }: Props = $props();

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();

    const getProgress = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => runwayRef,
        () => boxRef,
    );
</script>

<div bind:this={boxRef} id={"carouselScrollBox"} class={styles.scrollBox}>
    <div class={styles.scrollPinned}>
        <Carousel
            computePlacement={props.computePlacement}
            slides={props.slides}
            bind:index
            progress={getProgress()}
            isLooping={false}
            isDisabled={props.isDisabled}
            orientation={props.orientation}
            ariaLabel={"Scrolled sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
        >
            {#snippet renderSlide(slide, state)}
                <SlideFront title={slide} {state} isNarrow={props.isNarrow} />
            {/snippet}

            {#snippet renderSlideBack()}
                <SlideBack isNarrow={props.isNarrow} />
            {/snippet}
        </Carousel>
    </div>

    <div bind:this={runwayRef} class={styles.scrollRunway}></div>
</div>
