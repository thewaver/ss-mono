<script lang="ts">
    import { untrack } from "svelte";

    import { Carousel, CarouselPlacementUtils } from "@thewaver/ss-components-svelte";
    import type { CarouselControls } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselBox from "../../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";
    import PageCarouselsBar from "../../CarouselsBar.svelte";

    const SLIDES = Array.from(
        { length: WINDOWED_SLIDE_COUNT },
        (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
    );

    let controls = $state.raw<CarouselControls>();
    let builtCount = $state(0);

    const countBuilt = () => {
        untrack(() => {
            builtCount += 1;
        });

        return () => {
            builtCount -= 1;
        };
    };
</script>

<div class={styles.docsCarousel}>
    <PageCarouselBox>
        <Carousel
            placement={CarouselPlacementUtils.track}
            slides={SLIDES}
            isWindowed={true}
            ariaLabel={"A hundred slides"}
            computeSlideLabel={computePositionLabel}
            onMount={(next) => {
                controls = next;
            }}
        >
            {#snippet renderSlide(slide, state)}
                <span {@attach countBuilt} hidden></span>
                <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
            {/snippet}
        </Carousel>

        {#if controls}
            <PageCarouselsBar {controls} />
        {/if}
    </PageCarouselBox>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Built: ${builtCount} of ${WINDOWED_SLIDE_COUNT}`}</div>
