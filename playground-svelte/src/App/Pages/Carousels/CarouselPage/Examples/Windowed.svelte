<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

    import PageCarouselBar from "../../../../StyledComponents/CarouselContent/PageCarouselBar.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselStep from "../../../../StyledComponents/CarouselContent/PageCarouselStep.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";

    const CAROUSEL_GAP = 10;

    const BUILT = 1;

    const SLIDES = Array.from(
        { length: WINDOWED_SLIDE_COUNT },
        (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
    );

    type Props = Omit<CarouselExampleProps, "slides"> & {
        onBuiltChange: (change: number) => void;
    };

    let { index = $bindable(), ...props }: Props = $props();

    const countBuilt = () => {
        props.onBuiltChange(BUILT);

        return () => props.onBuiltChange(-BUILT);
    };
</script>

<Carousel
    placement={props.placement}
    slides={SLIDES}
    bind:index
    isDisabled={props.isDisabled}
    isLooping={props.isLooping}
    isWindowed={true}
    orientation={props.orientation}
    transitionDurationMs={props.transitionDurationMs}
    gap={CAROUSEL_GAP}
    ariaLabel={"A hundred slides"}
    computeSlideLabel={computePositionLabel}
    computeStepLabel={computeCarouselStepLabel}
    computeRotationLabel={computeCarouselRotationLabel}
    renderControls={renderBar}
>
    {#snippet renderSlide(slide, state)}
        <div {@attach countBuilt} class={props.frameClasses.front}>
            <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
        </div>
    {/snippet}

    {#snippet renderSlideBack()}
        <SlideBack frameClass={props.frameClasses.back} />
    {/snippet}

    {#snippet renderStep(_step, renderProps)}
        <PageCarouselStep {renderProps} />
    {/snippet}
</Carousel>

{#snippet renderBar(controls: CarouselControls)}
    <PageCarouselBar>
        {@render controls.renderStep("previous")}
        {@render controls.renderStep("next")}
    </PageCarouselBar>
{/snippet}
