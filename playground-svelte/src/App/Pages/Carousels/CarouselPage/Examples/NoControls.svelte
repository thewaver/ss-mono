<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    type Props = CarouselExampleProps;

    let { index = $bindable(), ...props }: Props = $props();
</script>

<Carousel
    computePlacement={props.computePlacement}
    slides={props.slides}
    bind:index
    isDisabled={props.isDisabled}
    orientation={props.orientation}
    ariaLabel={"Bare sampler"}
    computeSlideLabel={computePositionLabel}
    computeStepLabel={computeCarouselStepLabel}
    computeRotationLabel={computeCarouselRotationLabel}
>
    {#snippet renderSlide(slide, state)}
        <SlideFront title={slide} {state} frameClass={props.frameClasses.front} />
    {/snippet}

    {#snippet renderSlideBack()}
        <SlideBack frameClass={props.frameClasses.back} />
    {/snippet}
</Carousel>
