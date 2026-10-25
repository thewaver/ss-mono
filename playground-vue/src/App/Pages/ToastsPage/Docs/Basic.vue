<script setup lang="ts">
import { Toasts } from "@thewaver/ss-components-vue";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import BasicRaisers from "./BasicRaisers.vue";
</script>

<template>
    <Toasts ariaLabel="Notifications">
        <BasicRaisers />

        <template #renderToast="{ toast, visibilityTarget, transitionDurationMs, state, dismiss }">
            <PageToastContent
                :toast="toast"
                :state="state"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                @dismiss="dismiss"
            />
        </template>
    </Toasts>
</template>
