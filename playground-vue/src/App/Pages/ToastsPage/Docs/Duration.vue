<script setup lang="ts">
import { shallowRef } from "vue";

import { Toasts } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastsDurationDocsExampleProps } from "../ToastsPageVue.types";
import DurationRaisers from "./DurationRaisers.vue";

defineProps<ToastsDurationDocsExampleProps>();

const shownCount = shallowRef(0);
const hiddenCount = shallowRef(0);
</script>

<template>
    <div :class="styles.example">
        <div :class="styles.raiseRow">
            <Toasts ariaLabel="Timed notifications" alignment="top_right">
                <DurationRaisers :duration-ms="durationMs" @show="shownCount += 1" @hide="hiddenCount += 1" />

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

        <div :class="exampleStyles.exampleReadout" data-readout>
            {{ `Shown: ${shownCount}, hidden: ${hiddenCount}` }}
        </div>
    </div>
</template>
