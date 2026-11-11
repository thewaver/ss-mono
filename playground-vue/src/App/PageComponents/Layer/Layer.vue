<script setup lang="ts">
import { LayerUtils } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.utils";

import PageLayerScope from "../../StyledComponents/Layer/Layer.vue";
import { provideLayerContext, useLayerContext } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

const props = defineProps<PageLayerProps>();

const parent = useLayerContext();

provideLayerContext({
    get level() {
        return props.level ?? LayerUtils.computeNextLevel(parent?.level);
    },
});
</script>

<template>
    <PageLayerScope><slot /></PageLayerScope>
</template>
