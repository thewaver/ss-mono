<script setup lang="ts">
import { shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonDocsExampleProps } from "../ButtonPageVue.types";

type Props = ButtonDocsExampleProps;

defineProps<Props>();

const clicks = shallowRef(0);
</script>

<template>
    <Button :is-disabled="isDisabled" :has-error="hasError" :is-pressed="isPressed" @click="() => void clicks++">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ `Clicks: ${clicks}` }}</PageButtonContent>
        </template>
    </Button>
</template>
