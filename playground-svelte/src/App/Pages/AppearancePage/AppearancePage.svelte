<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import {
        NO_MOTION_DURATION_MS,
        SKIN_OPTIONS,
        THEME_OPTIONS,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import type {
        PlaygroundSkin,
        PlaygroundTheme,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
    import {
        SKIN_ROW_GAP,
        computeSkinRowId,
        computeThemeRowId,
    } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

    import { getAppliedSkin, revealSkin } from "../../PageComponents/Skin/SkinSvelte.const.svelte";
    import { getAppliedTheme, revealTheme } from "../../PageComponents/Theme/ThemeSvelte.const.svelte";
    import SkinRow from "./SkinRow.svelte";
    import ThemeRow from "./ThemeRow.svelte";

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const pickTheme = (nextTheme: PlaygroundTheme | undefined) => {
        if (nextTheme === undefined) return;

        void revealTheme(nextTheme, {
            origin: document.getElementById(computeThemeRowId(nextTheme)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const pickSkin = (nextSkin: PlaygroundSkin | undefined) => {
        if (nextSkin === undefined) return;

        void revealSkin(nextSkin, {
            origin: document.getElementById(computeSkinRowId(nextSkin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };
</script>

<div class={styles.appearancePage} data-view={"appearance"}>
    <h1 class={styles.appearanceTitle}>Appearance</h1>

    <section class={styles.appearanceSection}>
        <h2 class={styles.appearanceHeading}>Theme</h2>

        <p class={styles.appearanceDescription}>
            A theme decides the playground's colors. Each row shows one theme: a column per color, a line per shade;
            picking a row applies it to every page.
        </p>

        <RadioGroup
            bind:value={getAppliedTheme, pickTheme}
            ariaLabel={"Theme"}
            orientation={"vertical"}
            gap={SKIN_ROW_GAP}
        >
            {#each THEME_OPTIONS as option (option.value)}
                <ThemeRow theme={option.value} label={option.label} />
            {/each}
        </RadioGroup>
    </section>

    <section class={styles.appearanceSection}>
        <h2 class={styles.appearanceHeading}>Skin</h2>

        <p class={styles.appearanceDescription}>
            A skin decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and
            where the theme's colors go. Each row shows the controls in one skin; picking a row applies it to every
            page.
        </p>

        <RadioGroup
            bind:value={getAppliedSkin, pickSkin}
            ariaLabel={"Skin"}
            orientation={"vertical"}
            gap={SKIN_ROW_GAP}
        >
            {#each SKIN_OPTIONS as option (option.value)}
                <SkinRow skin={option.value} label={option.label} />
            {/each}
        </RadioGroup>
    </section>
</div>
