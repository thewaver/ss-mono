<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from "vue";

import { Typewriter } from "@thewaver/ss-components-vue";
import type { TypewriterController } from "@thewaver/ss-components-vue";
import { FunctionUtils } from "@thewaver/ss-utils";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

const TEXT_SETTLE_MS = 500;

type Props = TypewriterExampleProps & {
    text: string;
};

const props = defineProps<Props>();

const text = shallowRef(props.text);

let controller: TypewriterController | undefined;

const setTextDebounced = FunctionUtils.debounce((next: string) => {
    text.value = next;
}, TEXT_SETTLE_MS);

onBeforeUnmount(() => setTextDebounced.cancel());

watch(
    () => props.text,
    (next) => setTextDebounced(next),
    { immediate: true },
);

watch(text, () => {
    controller?.update("content");
});

const setController = (next: TypewriterController) => {
    controller = next;
};
</script>

<template>
    <Typewriter
        :animation-name="animationName"
        :compute-character-weights="computeCharacterWeights"
        @mount="setController"
        >{{ text }}</Typewriter
    >
</template>
