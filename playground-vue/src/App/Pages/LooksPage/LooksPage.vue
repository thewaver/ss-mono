<script setup lang="ts">
import { MediaQueryMonitorVueUtils, RadioGroup, SHAPE_REVEAL_DEFAULTS } from "@thewaver/ss-components-vue";
import {
    LOOK_OPTIONS,
    NO_MOTION_DURATION_MS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { LOOK_ROW_GAP, computeLookRowId } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";

import { appliedLook, revealLook } from "../../PageComponents/Look/LookVue.const";
import LookRow from "./LookRow.vue";

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const pickLook = (nextLook: PlaygroundLook) => {
    void revealLook(nextLook, {
        origin: document.getElementById(computeLookRowId(nextLook)) ?? SHAPE_REVEAL_DEFAULTS.origin,
        durationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
    });
};
</script>

<template>
    <div :class="styles.looksPage" data-view="looks">
        <h1 :class="styles.looksTitle">Looks</h1>

        <p :class="styles.looksDescription">
            A look decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and
            where the theme's colors go. Each row shows the controls in one look; picking a row applies it to every
            page.
        </p>

        <RadioGroup
            :value="appliedLook"
            ariaLabel="Look"
            orientation="vertical"
            :gap="LOOK_ROW_GAP"
            @update:value="pickLook"
        >
            <LookRow v-for="option in LOOK_OPTIONS" :key="option.value" :look="option.value" :label="option.label" />
        </RadioGroup>
    </div>
</template>
