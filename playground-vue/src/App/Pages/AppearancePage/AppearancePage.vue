<script setup lang="ts">
import { MediaQueryMonitorVueUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
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
    SKIN_DESCRIPTION,
    SKIN_ROW_GAP,
    THEME_DESCRIPTION,
    computeSkinRowId,
    computeThemeRowId,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

import { appliedSkin, revealSkin } from "../../PageComponents/Skin/SkinVue.const";
import { appliedTheme, revealTheme } from "../../PageComponents/Theme/ThemeVue.const";
import SkinRow from "./SkinRow.vue";
import ThemeRow from "./ThemeRow.vue";

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const pickTheme = (nextTheme: PlaygroundTheme) => {
    void revealTheme(nextTheme, {
        origin: document.getElementById(computeThemeRowId(nextTheme)) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};

const pickSkin = (nextSkin: PlaygroundSkin) => {
    void revealSkin(nextSkin, {
        origin: document.getElementById(computeSkinRowId(nextSkin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};
</script>

<template>
    <div :class="styles.appearancePage" data-view="appearance">
        <h1 :class="styles.appearanceTitle">Appearance</h1>

        <section :class="styles.appearanceSection">
            <h2 :class="styles.appearanceHeading">Theme</h2>

            <p :class="styles.appearanceDescription">{{ THEME_DESCRIPTION }}</p>

            <RadioGroup
                :value="appliedTheme"
                ariaLabel="Theme"
                orientation="vertical"
                :gap="SKIN_ROW_GAP"
                @update:value="pickTheme"
            >
                <ThemeRow
                    v-for="option in THEME_OPTIONS"
                    :key="option.value"
                    :theme="option.value"
                    :label="option.label"
                />
            </RadioGroup>
        </section>

        <section :class="styles.appearanceSection">
            <h2 :class="styles.appearanceHeading">Skin</h2>

            <p :class="styles.appearanceDescription">{{ SKIN_DESCRIPTION }}</p>

            <RadioGroup
                :value="appliedSkin"
                ariaLabel="Skin"
                orientation="vertical"
                :gap="SKIN_ROW_GAP"
                @update:value="pickSkin"
            >
                <SkinRow
                    v-for="option in SKIN_OPTIONS"
                    :key="option.value"
                    :skin="option.value"
                    :label="option.label"
                />
            </RadioGroup>
        </section>
    </div>
</template>
