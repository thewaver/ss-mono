<script setup lang="ts">
import { InteractionSettings, Toasts } from "@thewaver/ss-components-vue";
import { OWN_HOTKEYS } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import HotkeysRaisers from "./HotkeysRaisers.vue";
</script>

<template>
    <InteractionSettings :toast-hotkeys="OWN_HOTKEYS">
        <Toasts ariaLabel="Notifications on their own keys" alignment="top_center">
            <HotkeysRaisers />

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
    </InteractionSettings>
</template>
