<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonExampleProps } from "../ButtonPage.types";

type Props = ButtonExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Button is-disabled @click="props.onClick">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Click Me</PageButtonContent>
        </template>
    </Button>
</template>
