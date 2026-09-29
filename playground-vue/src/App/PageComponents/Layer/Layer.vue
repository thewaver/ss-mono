<script setup lang="ts">
import PageLayerScope from "../../StyledComponents/Layer/Layer.vue";
import { provideLayerContext } from "./Layer.context";
import type { PageLayerProps } from "./Layer.types";

const props = defineProps<PageLayerProps>();

provideLayerContext({
    get level() {
        return props.level;
    },
});
</script>

<template>
    <PageLayerScope><slot /></PageLayerScope>
</template>
