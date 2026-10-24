<script lang="ts">
    import { onDestroy } from "svelte";

    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ButtonCounterExampleProps } from "../ButtonPageSvelte.types";

    const REPEAT_DELAY_MS = 400;
    const REPEAT_INTERVAL_MS = 80;

    type Props = ButtonCounterExampleProps;

    let props: Props = $props();

    let repeatTimer: ReturnType<typeof setTimeout> | undefined;
    let isPointerPress = false;

    const stopRepeating = () => {
        clearTimeout(repeatTimer);
    };

    const repeat = (step: number, waitMs: number) => {
        repeatTimer = setTimeout(() => {
            props.onStep(step);
            repeat(step, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    onDestroy(stopRepeating);
</script>

{#snippet stepButton(ariaLabel: string, glyph: string, step: number)}
    <Button
        {ariaLabel}
        onPointerDown={() => {
            isPointerPress = true;
            props.onStep(step);
            repeat(step, REPEAT_DELAY_MS);
        }}
        onPointerUp={(e) => {
            stopRepeating();

            if (e.type === "pointercancel") isPointerPress = false;
        }}
        onMouseLeave={() => {
            stopRepeating();
            isPointerPress = false;
        }}
        onClick={() => {
            if (isPointerPress) {
                isPointerPress = false;

                return;
            }

            props.onStep(step);
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} {glyph} />
        {/snippet}
    </Button>
{/snippet}

<div class={styles.counter}>
    {@render stepButton("Decrease", "▼", -1)}

    <div class={styles.counterValue}>{props.count}</div>

    {@render stepButton("Increase", "▲", 1)}
</div>
