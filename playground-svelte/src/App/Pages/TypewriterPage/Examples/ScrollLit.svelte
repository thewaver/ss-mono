<script lang="ts">
    import { ElementObserverSvelteUtils, Typewriter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

    const TEXT =
        "Every word here waits, dimmed, until it reaches the middle of the box, then lights up in reading order as it passes — and dims again on the way back down.";
    const LIT_BAND_PX = 24;
    const CHARACTER_DELAY_MS = 30;
    const CHARACTER_DURATION_MS = 400;

    let boxRef = $state<HTMLDivElement>();
    let ref = $state<HTMLDivElement>();

    const getTravel = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => ref,
        () => boxRef,
    );

    const lit = $derived.by(() => {
        getTravel();

        return TypewriterPageUtils.computeMiddleLineShare(boxRef, ref, LIT_BAND_PX);
    });
</script>

<div bind:this={boxRef} id={"scrollLitScrollBox"} class={styles.scrollBox}>
    <div bind:this={ref} class={styles.scrollParagraph}>
        <Typewriter
            progress={lit}
            playback={false}
            computeAnimationName={() => styles.typewriterLight}
            animationDelayMs={CHARACTER_DELAY_MS}
            animationDurationMs={CHARACTER_DURATION_MS}
        >
            {TEXT}
        </Typewriter>
    </div>
</div>
