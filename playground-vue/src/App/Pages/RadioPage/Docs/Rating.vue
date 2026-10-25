<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.vue";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const value = shallowRef(STARTING_RATING);
const hovered = shallowRef<number>();
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Rating" orientation="horizontal" :gap="0">
        <Radio
            v-for="rating in RATING_OPTIONS"
            :key="rating"
            :value="rating"
            :ariaLabel="rating === 1 ? '1 star' : `${rating} stars`"
            @mouse-enter="hovered = rating"
            @mouse-leave="hovered = undefined"
        >
            <template #renderContent="flags">
                <PageRadioStarContent :flags="flags" :is-filled="rating <= (hovered ?? value)" />
            </template>
        </Radio>
    </RadioGroup>
</template>
