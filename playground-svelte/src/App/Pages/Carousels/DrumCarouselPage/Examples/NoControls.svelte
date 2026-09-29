<script lang="ts">
    import { DrumCarousel } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.svelte";
    import type { DrumCarouselExampleProps } from "../../Carousels.types";

    const SLIDE_SIZE = { width: 260, height: 140 };

    type Props = DrumCarouselExampleProps;

    let { index = $bindable(), ...props }: Props = $props();
</script>

<DrumCarousel
    slides={props.slides}
    bind:index
    isDisabled={props.isDisabled}
    axis={props.axis}
    slideSize={SLIDE_SIZE}
    ariaLabel={"Bare barrel sampler"}
    computeSlideLabel={computePositionLabel}
    computeStepLabel={computeCarouselStepLabel}
    computeRotationLabel={computeCarouselRotationLabel}
>
    {#snippet renderSlide(slide, state)}
        <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
    {/snippet}

    {#snippet renderSlideBack()}
        <PageCarouselSlideBack />
    {/snippet}
</DrumCarousel>
