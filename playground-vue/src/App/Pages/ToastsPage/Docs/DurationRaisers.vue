<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";
import type { ToastsDurationRaisersProps } from "../ToastsPageVue.types";

const props = defineProps<ToastsDurationRaisersProps>();

const toasts = useToastsContext<ToastDefs>();

const raise = (durationMs: number | undefined) => {
    toasts.show({
        value: { kind: "success", message: MESSAGES.success },
        announcement: MESSAGES.success,
        durationMs,
        onShow: props.onShow,
        onHide: props.onHide,
    });
};
</script>

<template>
    <Button id="durationTimed" @click="raise(durationMs)">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Timed</PageButtonContent>
        </template>
    </Button>
    <Button id="durationSticky" @click="raise(undefined)">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Sticky</PageButtonContent>
        </template>
    </Button>
</template>
