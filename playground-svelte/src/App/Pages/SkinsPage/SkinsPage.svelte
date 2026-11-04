<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
        SKIN_OPTIONS,
        NO_MOTION_DURATION_MS,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
    import { SKIN_ROW_GAP, computeSkinRowId } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

    import { getAppliedSkin, revealSkin } from "../../PageComponents/Skin/SkinSvelte.const.svelte";
    import SkinRow from "./SkinRow.svelte";

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const pickSkin = (nextSkin: PlaygroundSkin | undefined) => {
        if (nextSkin === undefined) return;

        void revealSkin(nextSkin, {
            origin: document.getElementById(computeSkinRowId(nextSkin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };
</script>

<div class={styles.skinsPage} data-view={"skins"}>
    <h1 class={styles.skinsTitle}>Skins</h1>

    <p class={styles.skinsDescription}>
        A skin decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where
        the theme's colors go. Each row shows the controls in one skin; picking a row applies it to every page.
    </p>

    <RadioGroup bind:value={getAppliedSkin, pickSkin} ariaLabel={"Skin"} orientation={"vertical"} gap={SKIN_ROW_GAP}>
        {#each SKIN_OPTIONS as option (option.value)}
            <SkinRow skin={option.value} label={option.label} />
        {/each}
    </RadioGroup>
</div>
