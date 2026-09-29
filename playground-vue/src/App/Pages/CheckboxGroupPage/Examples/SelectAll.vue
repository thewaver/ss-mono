<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import type { CheckboxGroupController } from "@thewaver/ss-components-vue";
import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-vue";
import {
    GROUP_GAP,
    TOPPINGS_WITH_SOLD_OUT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const group = shallowRef<CheckboxGroupController>();

const parentState = computed(() => group.value?.getCheckedState() ?? false);
</script>

<template>
    <div :class="styles.column">
        <Label>
            <Checkbox
                id="allToppings"
                :checked="parentState === true"
                :is-mixed="parentState === 'mixed'"
                @update:checked="(isChecked: boolean) => group?.setIsEveryChecked(isChecked)"
            >
                <template #renderContent="flags">
                    <PageCheckboxContent :flags="flags" />
                </template>
            </Checkbox>

            <PageLabelCaption>All toppings</PageLabelCaption>
        </Label>

        <div :class="styles.members">
            <CheckboxGroup
                v-model:value="value"
                ariaLabel="Toppings"
                orientation="vertical"
                :gap="GROUP_GAP"
                @mount="(controller: CheckboxGroupController) => (group = controller)"
            >
                <Label v-for="topping in TOPPINGS_WITH_SOLD_OUT" :key="topping.value">
                    <Checkbox :value="topping.value" :is-disabled="topping.isSoldOut ?? false">
                        <template #renderContent="flags">
                            <PageCheckboxContent :flags="flags" />
                        </template>
                    </Checkbox>

                    <PageLabelCaption>{{ topping.label }}</PageLabelCaption>
                </Label>
            </CheckboxGroup>
        </div>
    </div>
</template>
