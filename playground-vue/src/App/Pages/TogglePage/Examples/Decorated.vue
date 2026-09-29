<script setup lang="ts">
import { useModel } from "vue";

import { Corners, Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import type { ToggleExampleProps } from "../TogglePage.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = ToggleExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Toggle v-model:checked="checked" ariaLabel="Decorated toggle" :is-pressed="checked">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags" />
        </template>

        <template #renderDecoration="flags">
            <Corners
                :color="flags.isPressed ? 'yellow' : 'transparent'"
                :corner-length="CORNER_LENGTH"
                :stroke-thickness="STROKE_THICKNESS"
            />
        </template>
    </Toggle>
</template>
