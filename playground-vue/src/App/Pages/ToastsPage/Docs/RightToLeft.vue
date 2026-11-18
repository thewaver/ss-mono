<script setup lang="ts">
import { Toasts } from "@thewaver/ss-components-vue";
import { PUBLISHING_NOTIFICATIONS_LABEL } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import RightToLeftRaisers from "./RightToLeftRaisers.vue";
</script>

<template>
    <div dir="rtl">
        <Toasts :ariaLabel="PUBLISHING_NOTIFICATIONS_LABEL" alignment="middle_left">
            <RightToLeftRaisers />

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
    </div>
</template>
