<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox, Corners } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = CheckboxExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Checkbox v-model:checked="checked" ariaLabel="Decorated checkbox" :is-pressed="checked">
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags" />
        </template>

        <template #renderDecoration="flags">
            <Corners
                :color="flags.isPressed ? 'yellow' : 'transparent'"
                :corner-length="CORNER_LENGTH"
                :stroke-thickness="STROKE_THICKNESS"
            />
        </template>
    </Checkbox>
</template>
