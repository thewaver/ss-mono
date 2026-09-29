<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-vue";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <CheckboxGroup v-model:value="value" ariaLabel="Toppings" orientation="vertical" :gap="GROUP_GAP">
        <Label v-for="topping in TOPPINGS" :key="topping.value">
            <Checkbox :value="topping.value">
                <template #renderContent="flags">
                    <PageCheckboxContent :flags="flags" />
                </template>
            </Checkbox>

            <PageLabelCaption>{{ topping.label }}</PageLabelCaption>
        </Label>
    </CheckboxGroup>
</template>
