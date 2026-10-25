<script setup lang="ts">
import { shallowRef } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import type { ToggleBasicDocsExampleProps } from "../TogglePageVue.types";

type Props = ToggleBasicDocsExampleProps;

defineProps<Props>();

const checked = shallowRef(false);
</script>

<template>
    <Toggle v-model:checked="checked" :has-error="hasError" :is-disabled="isDisabled" ariaLabel="Default toggle">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags">Default toggle</PageToggleContent>
        </template>
    </Toggle>
</template>
