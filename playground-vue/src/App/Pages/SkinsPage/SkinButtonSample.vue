<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { SkinStateProps } from "./SkinsPage.types";

withDefaults(defineProps<SkinStateProps>(), { isPressed: undefined, isDisabled: undefined, hasError: undefined });
</script>

<template>
    <Button sizing="fill" :is-pressed="isPressed" :is-disabled="isDisabled" :has-error="hasError">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ state }}</PageButtonContent>
        </template>
    </Button>
</template>
