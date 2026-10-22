<script lang="ts">
    import { Carousel } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselsBar from "../../CarouselsBar.svelte";
    import type { CarouselExampleProps } from "../../Carousels.types";
    import SlideBack from "./SlideBack.svelte";

    const BUILT = 1;

    const SLIDES = Array.from(
        { length: WINDOWED_SLIDE_COUNT },
        (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
    );

    type Props = Omit<CarouselExampleProps, "slides"> & {
        onBuiltChange: (change: number) => void;
    };

    let { index = $bindable(), ...props }: Props = $props();

    let controls = $state.raw<CarouselControls>();

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
    ariaLabel={"A hundred slides"}
    computeSlideLabel={computePositionLabel}
    onMount={(next) => {
        controls = next;
    }}
>
    {#snippet renderSlide(slide, state)}
        <div {@attach countBuilt} class={props.frameClasses.front}>
            <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
        </div>
    {/snippet}

    {#snippet renderSlideBack()}
        <SlideBack frameClass={props.frameClasses.back} />
    {/snippet}
</Carousel>

{#if controls}
    <PageCarouselsBar {controls} isDisabled={props.isDisabled} />
{/if}
