<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.svelte";
    import PageCarouselPick from "../../../../StyledComponents/CarouselContent/PageCarouselPick.svelte";
    import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    const CAROUSEL_GAP = 10;

    type Props = CarouselExampleProps;

    let { index = $bindable(), ...props }: Props = $props();
</script>

<Carousel
    computePlacement={props.computePlacement}
    slides={props.slides}
    bind:index
    isDisabled={props.isDisabled}
    isLooping={props.isLooping}
    orientation={props.orientation}
    gap={CAROUSEL_GAP}
    ariaLabel={"Sampler"}
    computeSlideLabel={computePositionLabel}
    computeStepLabel={computeCarouselStepLabel}
    computeRotationLabel={computeCarouselRotationLabel}
    renderControls={renderBar}
>
    {#snippet renderSlide(slide, state)}
        <SlideFront title={slide} {state} isNarrow={props.isNarrow} />
    {/snippet}

    {#snippet renderSlideBack()}
        <SlideBack isNarrow={props.isNarrow} />
    {/snippet}

    {#snippet renderStep(_step, renderProps)}
        <PageCarouselStep {renderProps} />
    {/snippet}

    {#snippet renderPick(_index, renderProps)}
        <PageCarouselPick {renderProps} />
    {/snippet}
</Carousel>

{#snippet renderBar(controls: CarouselControls)}
    <PageCarouselBar>
        {@render controls.renderStep("previous")}
        {#each Array.from({ length: controls.count }) as _, index (index)}
            {@render controls.renderPick(index)}
        {/each}
        {@render controls.renderStep("next")}
    </PageCarouselBar>
{/snippet}
