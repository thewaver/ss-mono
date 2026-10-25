<script lang="ts">
    import { onDestroy } from "svelte";

    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";

    const REPEAT_DELAY_MS = 400;
    const REPEAT_INTERVAL_MS = 80;

    let count = $state(0);

    let repeatTimer: ReturnType<typeof setTimeout> | undefined;
    let isPointerPress = false;

    const step = (by: number) => {
        count += by;
    };

    const stopRepeating = () => {
        clearTimeout(repeatTimer);
    };

    const repeat = (by: number, waitMs: number) => {
        repeatTimer = setTimeout(() => {
            step(by);
            repeat(by, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    onDestroy(stopRepeating);
</script>

{#snippet stepButton(ariaLabel: string, glyph: string, by: number)}
    <Button
        {ariaLabel}
        onPointerDown={() => {
            isPointerPress = true;
            step(by);
            repeat(by, REPEAT_DELAY_MS);
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

            step(by);
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} {glyph} />
        {/snippet}
    </Button>
{/snippet}

<div class={styles.counter}>
    {@render stepButton("Decrease", "▼", -1)}

    <div class={styles.counterValue}>{count}</div>

    {@render stepButton("Increase", "▲", 1)}
</div>
