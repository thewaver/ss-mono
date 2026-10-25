<script lang="ts">
    import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import {
        computeGroupPositionLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { PAIRED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { computePairs } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselsBar from "../../CarouselsBar.svelte";

    const SLIDES = TITLES.slice(0, PAIRED_SLIDE_COUNT);

    let controls = $state.raw<CarouselControls>();
</script>

<div class={styles.docsCarousel}>
    <PageCarouselBox>
        <Carousel
            placement={CarouselPlacementUtils.track}
            slides={SLIDES}
            ariaLabel={"Pairs"}
            computeSlideLabel={computePositionLabel}
            computeGroups={computePairs}
            computeGroupLabel={computeGroupPositionLabel}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderSlide(slide, state)}
                <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
            {/snippet}
        </Carousel>

        {#if controls}
            <PageCarouselsBar {controls} hasPicks={true} />
        {/if}
    </PageCarouselBox>
</div>
