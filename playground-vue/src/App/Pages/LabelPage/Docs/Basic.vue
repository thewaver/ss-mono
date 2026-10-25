<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, Label } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { LabelBasicDocsExampleProps } from "../LabelPageVue.types";

type Props = LabelBasicDocsExampleProps;

defineProps<Props>();

const checked = shallowRef(false);
</script>

<template>
    <Label :orientation="orientation">
        <Checkbox v-model:checked="checked" :is-disabled="isDisabled">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <PageLabelCaption id="rememberCaption">Remember me</PageLabelCaption>
    </Label>
</template>
