<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselsBar from "../../CarouselsBar.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";
    import SlideFront from "./SlideFront.svelte";

    type Props = CarouselExampleProps;

    let { index = $bindable(), playback = $bindable(true), ...props }: Props = $props();

    let controls = $state.raw<CarouselControls>();
</script>

<Carousel
    placement={props.placement}
    slides={props.slides}
    bind:index
    bind:playback
    isDisabled={props.isDisabled}
    isLooping={props.isLooping}
    orientation={props.orientation}
    transitionDurationMs={props.transitionDurationMs}
    autoplayDelayMs={props.autoplayDelayMs}
    ariaLabel={"Rotating sampler"}
    computeSlideLabel={computePositionLabel}
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
    <PageCarouselsBar {controls} isDisabled={props.isDisabled} hasPicks={true} hasRotation={true} />
{/if}
