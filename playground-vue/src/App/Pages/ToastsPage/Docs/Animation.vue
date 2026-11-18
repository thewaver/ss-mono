<script setup lang="ts">
import { Toasts } from "@thewaver/ss-components-vue";
import { ANIMATED_NOTIFICATIONS_LABEL } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastsAnimationDocsExampleProps } from "../ToastsPageVue.types";
import AnimationRaisers from "./AnimationRaisers.vue";

defineProps<ToastsAnimationDocsExampleProps>();
</script>

<template>
    <Toasts
        :ariaLabel="ANIMATED_NOTIFICATIONS_LABEL"
        alignment="top_left"
        :transition-duration-ms="transitionDurationMs"
    >
        <AnimationRaisers />

        <template
            #renderToast="{ toast, visibilityTarget, transitionDurationMs: toastTransitionDurationMs, state, dismiss }"
        >
            <PageToastContent
                :toast="toast"
                :state="state"
                :animation="animation"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="toastTransitionDurationMs"
                @dismiss="dismiss"
            />
        </template>
    </Toasts>
</template>
