<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonExampleProps } from "../ButtonPage.types";

const SAVE_DURATION_MS = 1000;

type Props = ButtonExampleProps;

const props = defineProps<Props>();

const save = () =>
    new Promise<void>((resolve) => {
        setTimeout(() => {
            props.onClick();
            resolve();
        }, SAVE_DURATION_MS);
    });
</script>

<template>
    <Button @click="save">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ flags.isPending ? "Saving…" : "Save" }}</PageButtonContent>
        </template>
    </Button>
</template>
