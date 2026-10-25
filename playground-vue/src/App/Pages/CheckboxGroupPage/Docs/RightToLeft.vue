<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-vue";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const value = shallowRef<string[]>(["cheese"]);
</script>

<template>
    <div dir="rtl">
        <CheckboxGroup v-model:value="value" ariaLabel="Toppings" orientation="horizontal" :gap="GROUP_GAP">
            <Checkbox
                v-for="topping in TOPPINGS"
                :key="topping.value"
                :value="topping.value"
                :ariaLabel="topping.label"
            >
                <template #renderContent="flags">
                    <PageCheckboxContent :flags="flags">{{ topping.label }}</PageCheckboxContent>
                </template>
            </Checkbox>
        </CheckboxGroup>
    </div>
</template>
