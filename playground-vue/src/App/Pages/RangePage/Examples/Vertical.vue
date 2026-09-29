<script setup lang="ts">
import { useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangeVerticalExampleProps } from "../RangePage.types";

const VERTICAL_LENGTH = 160;

type Props = RangeVerticalExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const range = useModel(props, "range");
</script>

<template>
    <PageControlRow>
        <Range
            id="verticalVolume"
            v-model:value="value"
            ariaLabel="Vertical volume"
            orientation="vertical"
            :thumb-size="RANGE_THUMB_SIZE"
        >
            <template #renderContent="renderProps">
                <PageRangeContent :render-props="renderProps" :length="VERTICAL_LENGTH" />
            </template>
        </Range>

        <PageControlRowLabel>and a pair</PageControlRowLabel>

        <Range
            v-model:range="range"
            ariaLabel="Vertical band"
            :thumb-labels="['Band floor', 'Band ceiling']"
            orientation="vertical"
            :thumb-size="RANGE_THUMB_SIZE"
        >
            <template #renderContent="renderProps">
                <PageRangeContent :render-props="renderProps" :length="VERTICAL_LENGTH" />
            </template>
        </Range>
    </PageControlRow>
</template>
