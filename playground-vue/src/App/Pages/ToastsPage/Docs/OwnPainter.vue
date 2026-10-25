<script setup lang="ts">
import { shallowRef } from "vue";

import { Toasts } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import OwnPainterRaisers from "./OwnPainterRaisers.vue";

const hasDraft = shallowRef(true);
</script>

<template>
    <div :class="styles.example">
        <Toasts ariaLabel="Draft notifications" alignment="bottom_center">
            <OwnPainterRaisers :has-draft="hasDraft" @delete="hasDraft = false" @restore="hasDraft = true" />

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

        <div :class="exampleStyles.exampleReadout" data-readout>{{ `Draft: ${hasDraft ? "kept" : "deleted"}` }}</div>
    </div>
</template>
