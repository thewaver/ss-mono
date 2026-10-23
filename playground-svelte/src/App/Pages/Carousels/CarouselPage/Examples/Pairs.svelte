<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import {
        computeGroupPositionLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        computePairs,
        toPairableSlides,
    } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";

    import PageCarouselsBar from "../../CarouselsBar.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    type Props = CarouselExampleProps;

    let { index = $bindable(), ...props }: Props = $props();

    let controls = $state.raw<CarouselControls>();

    const slides = $derived(toPairableSlides(props.slides));
</script>

<Carousel
    placement={props.placement}
    {slides}
    bind:index
    isDisabled={props.isDisabled}
    isLooping={props.isLooping}
    orientation={props.orientation}
    transitionDurationMs={props.transitionDurationMs}
    ariaLabel={"Pairs"}
    computeSlideLabel={computePositionLabel}
    computeGroups={computePairs}
    computeGroupLabel={computeGroupPositionLabel}
    onMount={(next) => {
        controls = next;
    }}
>
    {#snippet renderSlide(slide, state)}
        <SlideFront title={slide} {state} frameClass={props.frameClasses.front} />
    {/snippet}

    {#snippet renderSlideBack()}
        <SlideBack frameClass={props.frameClasses.back} />
    {/snippet}
</Carousel>

{#if controls}
    <PageCarouselsBar {controls} isDisabled={props.isDisabled} hasPicks={true} />
{/if}
