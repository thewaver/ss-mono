<script setup lang="ts">
import { useModel } from "vue";

import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import type { PreviewExampleProps } from "../PreviewPage.types";
import TextExample from "./Text.vue";

const AFTERWARDS = [
    "The rest of the page carries on below, which is the whole of the problem.",
    "Open the preview, read to the end of it, and close it again: everything under it jumps up by the height that just disappeared, and the control you pressed goes with it.",
    "With the scroll asked for, the box comes back to where you were standing.",
];

type Props = PreviewExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <div :class="styles.scrollBox" data-scroll-box="">
        <TextExample
            v-model:expanded="expanded"
            :collapsed-height="collapsedHeight"
            is-scrolled-into-view-on-collapse
            :paragraphs="paragraphs"
        />

        <div :class="styles.afterwards">
            <div v-for="paragraph in AFTERWARDS" :key="paragraph">{{ paragraph }}</div>
        </div>
    </div>
</template>
