<script setup lang="ts">
import { MediaQueryMonitorVueUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
import {
    NO_MOTION_DURATION_MS,
    SKIN_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { SKIN_ROW_GAP, computeSkinRowId } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

import { appliedSkin, revealSkin } from "../../PageComponents/Skin/SkinVue.const";
import SkinRow from "./SkinRow.vue";

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const pickSkin = (nextSkin: PlaygroundSkin) => {
    void revealSkin(nextSkin, {
        origin: document.getElementById(computeSkinRowId(nextSkin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};
</script>

<template>
    <div :class="styles.skinsPage" data-view="skins">
        <h1 :class="styles.skinsTitle">Skins</h1>

        <p :class="styles.skinsDescription">
            A skin decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and
            where the theme's colors go. Each row shows the controls in one skin; picking a row applies it to every
            page.
        </p>

        <RadioGroup
            :value="appliedSkin"
            ariaLabel="Skin"
            orientation="vertical"
            :gap="SKIN_ROW_GAP"
            @update:value="pickSkin"
        >
            <SkinRow v-for="option in SKIN_OPTIONS" :key="option.value" :skin="option.value" :label="option.label" />
        </RadioGroup>
    </div>
</template>
