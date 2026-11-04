<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { SkinStateProps } from "./SkinsPage.types";

withDefaults(defineProps<SkinStateProps>(), { isPressed: undefined, isDisabled: undefined, hasError: undefined });
</script>

<template>
    <Button :is-pressed="isPressed" :is-disabled="isDisabled" :has-error="hasError">
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags">{{ state }}</PageControlButtonContent>
        </template>
    </Button>
</template>
