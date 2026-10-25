<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorArea } from "@thewaver/ss-components-vue";
import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { STARTING_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import type { Color } from "@thewaver/ss-utils";

import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";

const AREA_SIZE = 160;

const hsv = shallowRef<Color.HSVA>(STARTING_HSV);
</script>

<template>
    <div dir="rtl" style="width: 100%">
        <ColorArea
            v-model:hsv="hsv"
            sizing="fill"
            ariaLabel="Saturation and brightness in a right-to-left box"
            :axis-labels="COLOR_AREA_AXIS_LABELS"
        >
            <template #renderContent="renderProps">
                <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
            </template>
        </ColorArea>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%` }}
    </div>
</template>
