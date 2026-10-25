<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { ARC_LAYOUT, ARC_WIDTH, STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageRadioStarCell from "../../../StyledComponents/RadioStarContent/PageRadioStarCell.vue";
import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.vue";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const value = shallowRef(STARTING_RATING);
const hovered = shallowRef<number>();
</script>

<template>
    <div :style="{ width: ARC_WIDTH }">
        <RadioGroup v-model:value="value" ariaLabel="Rating on an arc" :compute-layout="ARC_LAYOUT">
            <Radio
                v-for="rating in RATING_OPTIONS"
                :key="rating"
                :value="rating"
                :ariaLabel="rating === 1 ? '1 star' : `${rating} stars`"
                @mouse-enter="hovered = rating"
                @mouse-leave="hovered = undefined"
            >
                <template #renderContent="flags">
                    <PageRadioStarCell>
                        <PageRadioStarContent :flags="flags" :is-filled="rating <= (hovered ?? value)" />
                    </PageRadioStarCell>
                </template>
            </Radio>
        </RadioGroup>
    </div>
</template>
