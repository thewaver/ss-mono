<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { SkinSampleColumnProps } from "./AppearancePage.types";

defineProps<SkinSampleColumnProps>();

const nextLayerClass = useNextLayerClass();
</script>

<template>
    <div :class="[styles.skinColumn, nextLayerClass, isWide && styles.skinWideColumn]">
        <PageLayer>
            <div :class="styles.skinColumnName">{{ name }}</div>

            <slot />
        </PageLayer>
    </div>
</template>
