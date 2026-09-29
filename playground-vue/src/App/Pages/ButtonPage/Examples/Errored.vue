<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonErroredExampleProps } from "../ButtonPage.types";

type Props = ButtonErroredExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Button :has-error="hasError" @click="props.onClick">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Toggle Error</PageButtonContent>
        </template>
    </Button>
</template>
