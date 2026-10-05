<script lang="ts">
    import { Carousel, CarouselPlacementUtils, ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import type { CarouselExampleProps } from "../../Carousels.types";

    const computeWordDrumPlacement = CarouselPlacementUtils.createDrum({
        faceCount: CarouselKnobs.WORD_DRUM_FACE_COUNT,
        faceRatio: CarouselKnobs.WORD_DRUM_FACE_RATIO,
        perspectivePx: CarouselKnobs.WORD_DRUM_PERSPECTIVE_PX,
    });

    type Props = Pick<CarouselExampleProps, "index" | "isDisabled">;

    let { index = $bindable(), ...props }: Props = $props();

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();

    const getProgress = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => runwayRef,
        () => boxRef,
    );
</script>

<div bind:this={boxRef} id={"wordDrumScrollBox"} class={styles.scrollBox}>
    <div class={styles.scrollPinned}>
        <div class={styles.wordDrumSlot}>
            <Carousel
                computePlacement={computeWordDrumPlacement}
                slides={CarouselKnobs.WORD_DRUM_WORDS}
                bind:index
                progress={getProgress()}
                isLooping={false}
                isDisabled={props.isDisabled}
                orientation={"vertical"}
                ariaLabel={"Words on a drum"}
                computeSlideLabel={computePositionLabel}
                computeStepLabel={computeCarouselStepLabel}
                computeRotationLabel={computeCarouselRotationLabel}
            >
                {#snippet renderSlide(word)}
                    <div class={styles.wordDrumWord}>{word}</div>
                {/snippet}

                {#snippet renderSlideBack()}{/snippet}
            </Carousel>
        </div>
    </div>

    <div bind:this={runwayRef} class={styles.scrollRunway}></div>
</div>
