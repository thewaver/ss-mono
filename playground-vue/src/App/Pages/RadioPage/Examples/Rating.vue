<script setup lang="ts">
import { useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.vue";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

type Props = RadioRatingExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const hovered = useModel(props, "hovered");
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
