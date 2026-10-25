<script lang="ts">
    import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselsBar from "../../CarouselsBar.svelte";
    import type { CarouselLoopingDocsExampleProps } from "../CarouselPageSvelte.types";

    const SLIDES = TITLES.slice(0, SLIDE_COUNT);

    type Props = CarouselLoopingDocsExampleProps;

    let props: Props = $props();

    let controls = $state.raw<CarouselControls>();
</script>

<div class={styles.docsCarousel}>
    <PageCarouselBox>
        <Carousel
            placement={CarouselPlacementUtils.track}
            slides={SLIDES}
            isLooping={props.isLooping}
            autoplayDelayMs={props.autoplayDelayMs}
            ariaLabel={"Rotating"}
            computeSlideLabel={computePositionLabel}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderSlide(slide, state)}
                <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
            {/snippet}
        </Carousel>

        {#if controls}
            <PageCarouselsBar {controls} hasPicks={true} hasRotation={true} />
        {/if}
    </PageCarouselBox>
</div>
