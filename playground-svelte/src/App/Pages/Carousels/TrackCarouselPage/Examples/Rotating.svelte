<script lang="ts">
    import { TrackCarousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.svelte";
    import PageCarouselPick from "../../../../StyledComponents/CarouselContent/PageCarouselPick.svelte";
    import PageCarouselRotation from "../../../../StyledComponents/CarouselContent/PageCarouselRotation.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";

    const CAROUSEL_GAP = 10;

    type Props = CarouselExampleProps;

    let { index = $bindable(), playback = $bindable(true), ...props }: Props = $props();
</script>

<TrackCarousel
    slides={props.slides}
    bind:index
    bind:playback
    isDisabled={props.isDisabled}
    isLooping={props.isLooping}
    orientation={props.orientation}
    autoplayDelayMs={props.autoplayDelayMs}
    gap={CAROUSEL_GAP}
    ariaLabel={"Rotating sampler"}
    computeSlideLabel={computePositionLabel}
    computeStepLabel={computeCarouselStepLabel}
    computeRotationLabel={computeCarouselRotationLabel}
    renderControls={renderBar}
>
    {#snippet renderSlide(slide, state)}
        <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
    {/snippet}

    {#snippet renderStep(_step, renderProps)}
        <PageCarouselStep {renderProps} />
    {/snippet}

    {#snippet renderPick(_index, renderProps)}
        <PageCarouselPick {renderProps} />
    {/snippet}

    {#snippet renderRotationControl(flags)}
        <PageCarouselRotation {flags} />
    {/snippet}
</TrackCarousel>

{#snippet renderBar(controls: CarouselControls)}
    <PageCarouselBar>
        {@render controls.renderRotationControl()}
        {@render controls.renderStep("previous")}
        {#each Array.from({ length: controls.count }) as _, index (index)}
            {@render controls.renderPick(index)}
        {/each}
        {@render controls.renderStep("next")}
    </PageCarouselBar>
{/snippet}
