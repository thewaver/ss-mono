<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
        LOOK_OPTIONS,
        NO_MOTION_DURATION_MS,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
    import { LOOK_ROW_GAP, computeLookRowId } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

    import { getAppliedLook, revealLook } from "../../PageComponents/Look/LookSvelte.const.svelte";
    import LookRow from "./LookRow.svelte";

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const pickLook = (nextLook: PlaygroundLook | undefined) => {
        if (nextLook === undefined) return;

        void revealLook(nextLook, {
            origin: document.getElementById(computeLookRowId(nextLook)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };
</script>

<div class={styles.looksPage} data-view={"looks"}>
    <h1 class={styles.looksTitle}>Looks</h1>

    <p class={styles.looksDescription}>
        A look decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where
        the theme's colors go. Each row shows the controls in one look; picking a row applies it to every page.
    </p>

    <RadioGroup bind:value={getAppliedLook, pickLook} ariaLabel={"Look"} orientation={"vertical"} gap={LOOK_ROW_GAP}>
        {#each LOOK_OPTIONS as option (option.value)}
            <LookRow look={option.value} label={option.label} />
        {/each}
    </RadioGroup>
</div>
