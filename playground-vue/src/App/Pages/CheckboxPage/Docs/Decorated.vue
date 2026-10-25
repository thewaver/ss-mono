<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, CornerHighlight } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

const checked = shallowRef(true);
</script>

<template>
    <Checkbox v-model:checked="checked" ariaLabel="Decorated checkbox" :is-pressed="checked">
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags">Decorated checkbox</PageCheckboxContent>
        </template>

        <template #renderDecoration="flags">
            <CornerHighlight
                :color="flags.isPressed ? 'yellow' : 'transparent'"
                :corner-length="CORNER_LENGTH"
                :stroke-thickness="STROKE_THICKNESS"
            />
        </template>
    </Checkbox>
</template>
