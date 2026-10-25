<script lang="ts">
    import { Carousel, CarouselPlacementUtils, ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import { computePositionLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";

    const SLIDES = TITLES.slice(0, SLIDE_COUNT);

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();

    const getProgress = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => runwayRef,
        () => boxRef,
    );
</script>

<div class={styles.docsCarousel}>
    <div bind:this={boxRef} class={styles.scrollBox}>
        <div class={styles.scrollPinned}>
            <Carousel
                placement={CarouselPlacementUtils.track}
                slides={SLIDES}
                progress={getProgress()}
                isLooping={false}
                ariaLabel={"Scrolled"}
                computeSlideLabel={computePositionLabel}
            >
                {#snippet renderSlide(slide, state)}
                    <PageCarouselSlide {state}>{slide}</PageCarouselSlide>
                {/snippet}
            </Carousel>
        </div>

        <div bind:this={runwayRef} class={styles.scrollRunway}></div>
    </div>
</div>
