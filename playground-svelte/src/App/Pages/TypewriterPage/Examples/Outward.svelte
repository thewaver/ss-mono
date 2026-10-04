<script lang="ts">
    import {
        ElementObserverSvelteUtils,
        MediaQueryMonitorSvelteUtils,
        ScrambleTextWeights,
        Typewriter,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

    const TEXT = "Scroll me past the middle";
    const FLY_BAND_PX = 80;
    const CHARACTER_DELAY_MS = 40;
    const CHARACTER_DURATION_MS = 500;
    const HALF = 0.5;

    let boxRef = $state<HTMLDivElement>();
    let ref = $state<HTMLDivElement>();

    const getTravel = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => ref,
        () => boxRef,
    );

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const flown = $derived.by(() => {
        getTravel();

        return TypewriterPageUtils.computeMiddleLineShare(boxRef, ref, FLY_BAND_PX);
    });

    const computeAnimationName = (_character: string, index: number, count: number) => {
        if (getPrefersReducedMotion()) return styles.typewriterFadeOut;

        return index < count * HALF ? styles.typewriterFlyLeft : styles.typewriterFlyRight;
    };
</script>

<div bind:this={boxRef} id={"outwardScrollBox"} class={styles.scrollBox}>
    <div bind:this={ref} class={styles.scrollParagraph}>
        <Typewriter
            progress={flown}
            playback={false}
            {computeAnimationName}
            computeCharacterWeights={ScrambleTextWeights.SAMPLE_WEIGHTS.fromMiddle}
            animationDelayMs={CHARACTER_DELAY_MS}
            animationDurationMs={CHARACTER_DURATION_MS}
        >
            {TEXT}
        </Typewriter>
    </div>
</div>
