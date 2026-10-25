<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { CheckboxGroupController } from "@thewaver/ss-components-vue";
import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    GROUP_GAP,
    TOPPINGS_WITH_SOLD_OUT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const value = shallowRef<string[]>(["cheese", "olives"]);
const group = shallowRef<CheckboxGroupController>();

const parentState = computed(() => group.value?.getCheckedState() ?? false);
</script>

<template>
    <div :class="styles.column">
        <Checkbox
            id="allToppings"
            :checked="parentState === true"
            :is-mixed="parentState === 'mixed'"
            ariaLabel="All toppings"
            @update:checked="(isChecked: boolean) => group?.setIsEveryChecked(isChecked)"
        >
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">All toppings</PageCheckboxContent>
            </template>
        </Checkbox>

        <div :class="styles.members">
            <CheckboxGroup
                v-model:value="value"
                ariaLabel="Toppings"
                orientation="vertical"
                :gap="GROUP_GAP"
                @mount="(controller: CheckboxGroupController) => (group = controller)"
            >
                <Checkbox
                    v-for="topping in TOPPINGS_WITH_SOLD_OUT"
                    :key="topping.value"
                    :value="topping.value"
                    :is-disabled="topping.isSoldOut ?? false"
                    :ariaLabel="topping.label"
                >
                    <template #renderContent="flags">
                        <PageCheckboxContent :flags="flags">{{ topping.label }}</PageCheckboxContent>
                    </template>
                </Checkbox>
            </CheckboxGroup>
        </div>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Value: ${value.length > 0 ? value.join(", ") : "none"}` }}
    </div>
</template>
