<script lang="ts">
    import { TrackCarousel } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";

    type Props = CarouselExampleProps;

    let { index = $bindable(), ...props }: Props = $props();
</script>

<TrackCarousel
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
        <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
    {/snippet}
</TrackCarousel>
