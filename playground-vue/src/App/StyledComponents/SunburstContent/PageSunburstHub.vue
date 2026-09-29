<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSunburstHubProps } from "./SunburstContent.types";

defineProps<PageSunburstHubProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.sunburstHub,
            layerClass,
            flags.isHovered && styles.sunburstHubHovered,
            flags.isDisabled && styles.sunburstHubAtRoot,
        ]"
    >
        <span :class="styles.sunburstHubName">{{ name }}</span>

        <span :class="styles.sunburstHubWeight">{{ weight }}</span>
    </div>
</template>
