<script setup lang="ts">
import { shallowRef } from "vue";

import { ImageSwitcher } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";

import type { ImageSwitcherBasicDocsExampleProps } from "../ImageSwitcherPageVue.types";

type Props = ImageSwitcherBasicDocsExampleProps;

defineProps<Props>();

const loadCount = shallowRef(0);
const loadedName = shallowRef<string>();

const handleLoad = (e: Event) => {
    const loaded = (e.target as HTMLImageElement).src;

    loadCount.value += 1;
    loadedName.value = loaded.slice(loaded.lastIndexOf("/") + 1);
};
</script>

<template>
    <div :class="styles.docsFrame">
        <ImageSwitcher :src="src" :alt="alt" :transition-duration-ms="transitionDurationMs" @load="handleLoad" />
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Loads: ${loadCount} · last loaded: ${loadedName ?? "nothing yet"}` }}
    </div>
</template>
