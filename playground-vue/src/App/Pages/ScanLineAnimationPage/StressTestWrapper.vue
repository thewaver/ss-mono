<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import StressItem, { STRESS_ITEMS } from "./StressItem.vue";

const props = defineProps<ScanlineAnimationExampleProps>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);
</script>

<template>
    <div>120 lines</div>

    <StressTest :configs="STRESS_ITEMS" @hide-modal="playback = true" @show-modal="playback = false">
        <template #renderLabel="{ configIndex }">{{
            `Render ${STRESS_ITEMS[configIndex].count} ${STRESS_ITEMS[configIndex].kind} items`
        }}</template>

        <template #renderItem="{ configIndex }">
            <StressItem v-bind="props" v-model:modal-playback="modalPlayback" :config-index="configIndex" />
        </template>
    </StressTest>
</template>
