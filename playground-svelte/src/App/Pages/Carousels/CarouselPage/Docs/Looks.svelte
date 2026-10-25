<script lang="ts">
    import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
    import { toFramedPlacement } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.utils";

    import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.svelte";
    import PageCarouselsBar from "../../CarouselsBar.svelte";
    import type { CarouselLooksDocsExampleProps } from "../CarouselPageSvelte.types";

    const SLIDES = TITLES.slice(0, SLIDE_COUNT);

    type Props = CarouselLooksDocsExampleProps;

    let props: Props = $props();

    let controls = $state.raw<CarouselControls>();

    const placement = $derived(
        CarouselPlacementUtils.toPlacementRule(toFramedPlacement(props.placement, props.orientation)),
    );

    const frames = $derived(styles.slideFrames[PLACEMENT_FRAMES[props.placement] ?? "whole"][props.orientation]);
</script>

<div class={styles.docsCarousel}>
    <PageCarouselBox>
        <Carousel
            {placement}
            slides={SLIDES}
            orientation={props.orientation}
            ariaLabel={"Looks"}
            computeSlideLabel={computePositionLabel}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderSlide(slide, state)}
                <div class={frames.front}>
                    <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
                </div>
            {/snippet}

            {#snippet renderSlideBack()}
                <div class={frames.back}>
                    <PageCarouselSlideBack />
                </div>
            {/snippet}
        </Carousel>

        {#if controls}
            <PageCarouselsBar {controls} hasPicks={true} />
        {/if}
    </PageCarouselBox>
</div>
