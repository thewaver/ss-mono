<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const value = shallowRef<string[]>(["cheese"]);
</script>

<template>
    <CheckboxGroup v-model:value="value" ariaLabel="Toppings" orientation="vertical" :gap="GROUP_GAP">
        <Checkbox v-for="topping in TOPPINGS" :key="topping.value" :value="topping.value" :ariaLabel="topping.label">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">{{ topping.label }}</PageCheckboxContent>
            </template>
        </Checkbox>
    </CheckboxGroup>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Value: ${value.length > 0 ? value.join(", ") : "none"}` }}
    </div>
</template>
