<script setup lang="ts">
import { Radio } from "@thewaver/ss-components-vue";
import {
    THEME_SWATCH_FAMILIES,
    THEME_SWATCH_SHADES,
    computeThemeRowId,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.vue";
import type { ThemeRowProps } from "./AppearancePage.types";

defineProps<ThemeRowProps>();
</script>

<template>
    <Radio :value="theme" :ariaLabel="label" sizing="fill">
        <template #renderContent="flags">
            <div :id="computeThemeRowId(theme)" :class="[styles.skinRow, PLAYGROUND_THEMES[theme]]">
                <div :class="styles.skinSamples">
                    <PageRadioContent :flags="flags">{{ label }}</PageRadioContent>

                    <div :class="styles.themeGrid" inert aria-hidden="true">
                        <span />

                        <span v-for="family in THEME_SWATCH_FAMILIES" :key="family" :class="styles.skinColumnName">
                            {{ family }}
                        </span>

                        <template v-for="shade in THEME_SWATCH_SHADES" :key="shade">
                            <span :class="styles.skinColumnName">{{ shade }}</span>

                            <div
                                v-for="family in THEME_SWATCH_FAMILIES"
                                :key="family"
                                :class="styles.themeSwatches[family][shade]"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </Radio>
</template>
