<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import type { CheckboxBasicDocsExampleProps } from "../CheckboxPageVue.types";

type Props = CheckboxBasicDocsExampleProps;

defineProps<Props>();

const checked = shallowRef(false);
</script>

<template>
    <Checkbox v-model:checked="checked" :has-error="hasError" :is-disabled="isDisabled" ariaLabel="Default checkbox">
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags">Default checkbox</PageCheckboxContent>
        </template>
    </Checkbox>
</template>
