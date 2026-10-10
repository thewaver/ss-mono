<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.css";
import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

import PageCodeBox from "../CodeBox/CodeBox.vue";
import PageLayer from "../Layer/Layer.vue";
import type { PageArticleProps } from "./Article.types";

defineProps<PageArticleProps>();
</script>

<template>
    <div :class="styles.aboutPage" :data-view="view">
        <h1 :class="styles.aboutTitle">{{ title }}</h1>

        <section v-for="section in sections" :key="section.heading" :class="styles.aboutSection">
            <h2 :class="styles.aboutHeading">{{ section.heading }}</h2>

            <template v-for="(block, index) in section.blocks" :key="index">
                <p v-if="block.kind === 'paragraph'" :class="styles.aboutParagraph">
                    <template v-for="(inline, inlineIndex) in block.text" :key="inlineIndex">
                        <template v-if="typeof inline === 'string'">{{ inline }}</template>
                        <a v-else :href="inline.href">{{ inline.text }}</a>
                    </template>
                </p>

                <ul v-else-if="block.kind === 'list'" :class="styles.aboutList">
                    <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
                        <template v-for="(inline, inlineIndex) in item" :key="inlineIndex">
                            <template v-if="typeof inline === 'string'">{{ inline }}</template>
                            <a v-else :href="inline.href">{{ inline.text }}</a>
                        </template>
                    </li>
                </ul>

                <PageLayer v-else :level="1">
                    <PageCodeBox :source="AboutPageUtils.toCodeHtml(block.language, block.source)" />
                </PageLayer>
            </template>
        </section>
    </div>
</template>
