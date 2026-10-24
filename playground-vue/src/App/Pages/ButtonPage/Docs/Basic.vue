<script setup lang="ts">
import { shallowRef } from "vue";

import { Button } from "@thewaver/ss-components-vue";

import type { ButtonDocsExampleProps } from "../ButtonPageVue.types";
import PressedButtonContent from "./PressedButtonContent.vue";

type Props = ButtonDocsExampleProps;

defineProps<Props>();

const clicks = shallowRef(0);
</script>

<template>
    <Button :is-disabled="isDisabled" :has-error="hasError" :is-pressed="isPressed" @click="() => void clicks++">
        <template #renderContent="flags">
            <PressedButtonContent :flags="flags">{{ `Clicks: ${clicks}` }}</PressedButtonContent>
        </template>
    </Button>
</template>
