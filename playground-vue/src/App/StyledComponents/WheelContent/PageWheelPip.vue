<script setup lang="ts">
import {
    PIP_PATH,
    PIP_SIDE_STYLES,
} from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageWheelPipProps } from "./WheelContentVue.types";

defineProps<PageWheelPipProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[PIP_SIDE_STYLES[side], layerClass]" aria-hidden="true">
        <svg :class="styles.wheelPipShape" viewBox="0 0 20 20">
            <path :d="PIP_PATH" />
        </svg>
    </div>
</template>
