<script setup lang="ts">
import { shallowRef, watch, watchEffect } from "vue";

import { Button, MorphText } from "@thewaver/ss-components-vue";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import { MORPH_WORDS } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { MorphTextExampleProps } from "../MorphTextPage.types";

type Props = MorphTextExampleProps;

const props = defineProps<Props>();

const index = shallowRef(0);
const isPlaying = shallowRef(true);

watchEffect((onCleanup) => {
    if (!isPlaying.value) return;

    const interval = setInterval(() => {
        index.value = (index.value + 1) % MORPH_WORDS.length;
    }, MorphTextKnobs.CYCLE_MS);

    onCleanup(() => clearInterval(interval));
});

watch(index, (next) => props.onWordChange(MORPH_WORDS[next]), { immediate: true });

const togglePlaying = () => {
    isPlaying.value = !isPlaying.value;
};
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.word">
            <MorphText :text="MORPH_WORDS[index]" :morph-duration-ms="morphDurationMs" :max-blur-px="maxBlurPx" />
        </div>

        <Button id="morphWordsPlayback" @click="togglePlaying">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isPlaying ? "Pause" : "Play" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
