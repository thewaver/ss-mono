<script setup lang="ts">
import { shallowRef } from "vue";

import { Surface } from "@thewaver/ss-components-vue";
import type { SurfaceProps } from "@thewaver/ss-components-vue";
import { Preview } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Card/Card.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import { CSSUtils } from "@thewaver/ss-utils";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";

const COLLAPSED_HEIGHT = 200;

const config: SurfaceProps = {
    borderRadii: CSSUtils.spreadRadius(styles.borderRadius),
    borderWidths: CSSUtils.spreadWidth(2),
    computeStrokeDefs: () => [
        {
            color: themeVars.color.primary.main,
            opacity: 0.5,
        },
    ],
    computeFillDefs: () => [
        {
            color: themeVars.color.primary.contrast,
        },
    ],
};

const expanded = shallowRef(false);
</script>

<template>
    <div :class="styles.root">
        <Surface v-bind="config">
            <div :class="styles.surfaceRoot">
                <div :class="styles.pic">
                    <img :src="knight_profile" width="100%" />
                    <div :class="styles.picContent">
                        <div :class="styles.name">{{ "Sir Face" }}</div>
                        <div :class="styles.role">{{
                            "UI/UX Vanguard | 600+ Years Forging Pixel-Perfect Experiences"
                        }}</div>
                    </div>
                </div>
                <div :class="styles.surfaceCntent">
                    <Preview v-model:expanded="expanded" :collapsed-height="COLLAPSED_HEIGHT">
                        <template #renderContent>
                            <div :class="styles.bios">
                                <div :class="styles.bio">{{
                                    "Greetings, travelers. I am Sir Face, and as my name implies, I am entirely dedicated to the presentation layer. For over six centuries, I’ve been defending users against terrible UI and slaying dragons in the DOM."
                                }}</div>
                                <div :class="styles.bio">{{
                                    "I began my career in the early 1400s, applying gold leaf to illuminated manuscripts—the original CSS. Since then, I've traded my broadsword for a mechanical keyboard, specializing in building robust, user-facing applications. I firmly believe that a user interface should be exactly like a good suit of plate armor: polished to a mirror shine, perfectly articulated, and capable of deflecting any critical errors."
                                }}</div>
                                <div :class="styles.bio">{{
                                    "Whether I'm aligning a flexbox or leading a cavalry charge against technical debt, I bring chivalry and pixel-perfection to every sprint."
                                }}</div>
                            </div>
                        </template>

                        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
                            <div
                                :class="styles.bioFade"
                                :style="{
                                    opacity: visibilityTarget,
                                    transition: `opacity ${transitionDurationMs}ms`,
                                }"
                            />
                        </template>

                        <template #renderTrigger="flags">
                            <PageButtonContent :flags="flags">{{
                                flags.isExpanded ? "Show less" : "Read more"
                            }}</PageButtonContent>
                        </template>
                    </Preview>
                </div>
            </div>
        </Surface>
    </div>
</template>
