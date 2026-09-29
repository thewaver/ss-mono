<script lang="ts">
    import { Button, MediaQueryMonitorSvelteUtils, Typewriter } from "@thewaver/ss-components-svelte";
    import type { TypewriterController, TypewriterMode } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { TypewriterPhrasesExampleProps } from "../TypewriterPage.types";

    const LEAD = "We build";
    const PHRASES = ["websites", "apps", "games"];
    const FIRST_PHRASE = 0;
    const HOLD_MS = 1600;
    const CHARACTER_DELAY_MS = 80;
    const CHARACTER_DURATION_MS = 200;
    const NO_MOTION_MS = 0;

    type Props = TypewriterPhrasesExampleProps;

    let props: Props = $props();

    let controller: TypewriterController | undefined;
    let phraseIndex = $state(FIRST_PHRASE);
    let mode = $state<TypewriterMode>("type");
    let isPaused = $state(false);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let holdTimeout: ReturnType<typeof setTimeout> | undefined;
    let isStepWaiting = false;

    $effect(() => () => clearTimeout(holdTimeout));

    const step = () => {
        isStepWaiting = false;

        if (mode === "type") {
            mode = "erase";

            return;
        }

        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        mode = "type";
        controller?.update("content");
    };

    const requestStep = () => {
        if (isPaused) {
            isStepWaiting = true;

            return;
        }

        step();
    };

    const handleAnimationEnd = () => {
        clearTimeout(holdTimeout);

        if (mode === "erase") {
            requestStep();

            return;
        }

        holdTimeout = setTimeout(requestStep, HOLD_MS);
    };

    const togglePause = () => {
        isPaused = !isPaused;

        if (!isPaused && isStepWaiting) step();
    };
</script>

<div class={styles.phraseStack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <div class={styles.phraseLine}>
            <span>{LEAD}</span>

            <div class={styles.phraseSlot}>
                <Typewriter
                    {mode}
                    animationName={props.animationName}
                    animationDelayMs={getPrefersReducedMotion() ? NO_MOTION_MS : CHARACTER_DELAY_MS}
                    animationDurationMs={getPrefersReducedMotion() ? NO_MOTION_MS : CHARACTER_DURATION_MS}
                    computeCharacterWeights={props.computeCharacterWeights}
                    onMount={(next) => {
                        controller = next;
                    }}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {PHRASES[phraseIndex]}

                    {#snippet renderCaret()}
                        <span
                            class={[
                                styles.phraseCaret,
                                !isPaused && !getPrefersReducedMotion() && styles.phraseCaretBlinking,
                            ]}
                            aria-hidden="true"
                        ></span>
                    {/snippet}
                </Typewriter>
            </div>
        </div>
    </PageMeasureBox>

    <Button
        id={"pausePhrases"}
        onClick={() => {
            togglePause();
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isPaused ? "Resume" : "Pause"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
