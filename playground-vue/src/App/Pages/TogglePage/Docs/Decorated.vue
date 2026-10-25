<script setup lang="ts">
import { shallowRef } from "vue";

import { CornerHighlight, Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

const checked = shallowRef(true);
</script>

<template>
    <Toggle v-model:checked="checked" ariaLabel="Decorated toggle" :is-pressed="checked">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags">Decorated toggle</PageToggleContent>
        </template>

        <template #renderDecoration="flags">
            <CornerHighlight
                :color="flags.isPressed ? 'yellow' : 'transparent'"
                :corner-length="CORNER_LENGTH"
                :stroke-thickness="STROKE_THICKNESS"
            />
        </template>
    </Toggle>
</template>
