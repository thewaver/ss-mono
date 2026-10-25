<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { FAR_DOWN_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";
import type { ToastsFarDownSaveButtonProps } from "../ToastsPageVue.types";

const DURATION_MS = 4000;

const props = defineProps<ToastsFarDownSaveButtonProps>();

const toasts = useToastsContext<ToastDefs>();

const save = () => {
    props.onAnswer({
        id: toasts.show({
            value: { kind: "success", message: FAR_DOWN_MESSAGE },
            announcement: FAR_DOWN_MESSAGE,
            durationMs: DURATION_MS,
        }),
    });
};
</script>

<template>
    <Button :id="id" @click="save">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ caption }}</PageButtonContent>
        </template>
    </Button>
</template>
