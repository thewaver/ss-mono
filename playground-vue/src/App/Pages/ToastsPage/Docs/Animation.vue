<script setup lang="ts">
import { Toasts } from "@thewaver/ss-components-vue";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastsAnimationDocsExampleProps } from "../ToastsPageVue.types";
import AnimationRaisers from "./AnimationRaisers.vue";

defineProps<ToastsAnimationDocsExampleProps>();
</script>

<template>
    <Toasts ariaLabel="Animated notifications" alignment="top_left" :transition-duration-ms="transitionDurationMs">
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
