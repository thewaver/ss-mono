<script lang="ts">
    import { flushSync } from "svelte";

    import { Button, ShapeRevealUtils } from "@thewaver/ss-components-svelte";
    import { ShapeRevealKnobs } from "@thewaver/ss-playground/App/Knobs/ShapeReveals.const";
    import {
        NEXT_PANEL,
        PANEL_LINES,
        PANEL_TITLES,
        STARTING_PANEL,
        SWITCH_ID,
        toComputePoints,
    } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.css";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ShapeRevealExampleProps } from "../ShapeRevealPage.types";

    type Props = ShapeRevealExampleProps;

    let props: Props = $props();

    let panel = $state(STARTING_PANEL);

    const switchPanel = async () => {
        const shape = props.shape;
        const origin = props.origin;
        const next = NEXT_PANEL[panel];

        const hasAnimated = await ShapeRevealUtils.reveal(
            () => {
                panel = next;
                flushSync();
            },
            {
                origin: origin === ShapeRevealKnobs.BUTTON ? (document.getElementById(SWITCH_ID) ?? undefined) : origin,
                durationMs: props.durationMs,
                blur: props.blur,
                computePoints: toComputePoints(shape),
            },
        );

        props.onRun({ shape, origin, hasAnimated, panel: next });
    };
</script>

<div class={styles.stage}>
    <div class={[styles.panel, panel === "dawn" ? styles.panelDawn : styles.panelDusk]}>
        <span class={styles.panelTitle}>{PANEL_TITLES[panel]}</span>
        <span class={styles.panelLine}>{PANEL_LINES[panel]}</span>
    </div>

    <Button id={SWITCH_ID} onClick={switchPanel}>
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags}>Switch</PageControlButtonContent>
        {/snippet}
    </Button>
</div>
