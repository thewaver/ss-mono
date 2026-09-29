<script setup lang="ts">
import { useModel } from "vue";

import { ColorArea } from "@thewaver/ss-components-vue";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";
import type { ColorAreaExampleProps } from "../ColorAreaPage.types";

const AREA_SIZE = 160;

type Props = ColorAreaExampleProps;

const props = defineProps<Props>();

const hsv = useModel(props, "hsv");
</script>

<template>
    <ColorArea
        v-model:hsv="hsv"
        sizing="fill"
        :is-disabled="isDisabled ?? false"
        ariaLabel="Saturation and brightness"
        :axis-labels="COLOR_AREA_AXIS_LABELS"
    >
        <template #renderContent="renderProps">
            <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
        </template>
    </ColorArea>
</template>
