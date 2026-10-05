<script lang="ts">
    import { untrack } from "svelte";

    import { Button, MediaQueryMonitorSvelteUtils, ProximityText } from "@thewaver/ss-components-svelte";
    import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ProximityTextExampleProps } from "../ProximityTextPageSvelte.types";

    const MIDDLE = 0.5;
    const OVERSHOOT = 0.4;

    type Props = ProximityTextExampleProps;

    let props: Props = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let isMoving = $state(untrack(() => !getPrefersReducedMotion()));
    let x = $state(-OVERSHOOT);

    $effect(() => {
        if (!isMoving) return;

        let frameId: number;
        let lastMs = performance.now();

        const move = () => {
            const nowMs = performance.now();
            const span = 1 + OVERSHOOT * 2;

            x = ((x + OVERSHOOT + ((nowMs - lastMs) / ProximityTextKnobs.WAVE_LAP_MS) * span) % span) - OVERSHOOT;
            lastMs = nowMs;
            frameId = requestAnimationFrame(move);
        };

        frameId = requestAnimationFrame(move);

        return () => cancelAnimationFrame(frameId);
    });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={ProximityTextKnobs.BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <div class={styles.variableText}>
            <ProximityText
                reachPx={props.reachPx}
                isDisabled={props.isDisabled}
                pointSource={{ ratio: { x, y: MIDDLE } }}
            >
                A wave of weight rolls through this line
            </ProximityText>
        </div>
    </PageMeasureBox>

    <Button
        id={"waveMove"}
        onClick={() => {
            isMoving = !isMoving;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isMoving ? "Stop" : "Move"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
