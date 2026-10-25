<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Toasts } from "@thewaver/ss-components-vue";
import type { Toast } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";
import type { ToastsLimitDocsExampleProps } from "../ToastsPageVue.types";
import LimitRaisers from "./LimitRaisers.vue";

defineProps<ToastsLimitDocsExampleProps>();

const queue = shallowRef<Toast<ToastDefs>[]>([]);

const clear = () => {
    queue.value = [];
};
</script>

<template>
    <div :class="styles.example">
        <div :class="styles.raiseRow">
            <Toasts
                v-model:toasts="queue"
                ariaLabel="Limited notifications"
                alignment="bottom_left"
                :limit="limit"
                :overflow="overflow"
            >
                <LimitRaisers />

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

            <Button id="limitClear" @click="clear">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Clear</PageButtonContent>
                </template>
            </Button>
        </div>

        <div :class="exampleStyles.exampleReadout" data-readout>{{ `Queued: ${queue.length}` }}</div>
    </div>
</template>
