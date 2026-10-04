<script lang="ts">
    import { ElementObserverSvelteUtils, Typewriter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import { MathUtils } from "@thewaver/ss-utils";

    const TEXT =
        "Every word here waits, dimmed, until the paragraph is scrolled into view, then lights up in reading order as it travels up the box — and dims again on the way back down.";
    const LIT_FROM = 0.15;
    const LIT_SPAN = 0.35;
    const CHARACTER_DELAY_MS = 30;
    const CHARACTER_DURATION_MS = 400;

    let boxRef = $state<HTMLDivElement>();
    let ref = $state<HTMLDivElement>();

    const getTravel = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => ref,
        () => boxRef,
    );

    const lit = $derived(MathUtils.clamp01((getTravel() - LIT_FROM) / LIT_SPAN));
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
