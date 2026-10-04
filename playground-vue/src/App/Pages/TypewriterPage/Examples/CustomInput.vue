<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from "vue";

import { Typewriter } from "@thewaver/ss-components-vue";
import { FunctionUtils } from "@thewaver/ss-utils";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

const TEXT_SETTLE_MS = 500;

type Props = TypewriterExampleProps & {
    text: string;
};

const props = defineProps<Props>();

const text = shallowRef(props.text);

const setTextDebounced = FunctionUtils.debounce((next: string) => {
    text.value = next;
}, TEXT_SETTLE_MS);

onBeforeUnmount(() => setTextDebounced.cancel());

watch(
    () => props.text,
    (next) => setTextDebounced(next),
    { immediate: true },
);
</script>

<template>
    <Typewriter :compute-animation-name="computeAnimationName" :compute-character-weights="computeCharacterWeights">{{
        text
    }}</Typewriter>
</template>
