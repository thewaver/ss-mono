<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorArea } from "@thewaver/ss-components-vue";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";
import type { ColorAreaBasicDocsExampleProps } from "../ColorAreaPageVue.types";

const AREA_SIZE = 160;

type Props = ColorAreaBasicDocsExampleProps;

defineProps<Props>();

const hsv = shallowRef<Color.HSVA>(STARTING_HSV);
</script>

<template>
    <ColorArea
        v-model:hsv="hsv"
        sizing="fill"
        :is-disabled="isDisabled"
        ariaLabel="Saturation and brightness"
        :axis-labels="COLOR_AREA_AXIS_LABELS"
    >
        <template #renderContent="renderProps">
            <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
        </template>
    </ColorArea>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{
            `Hue ${Math.round(hsv.h)}°, saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%, or ${Color.HSV.toHex(hsv)}`
        }}
    </div>
</template>
