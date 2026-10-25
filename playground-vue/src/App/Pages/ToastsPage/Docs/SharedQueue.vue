<script lang="ts">
import { ToastUtils } from "@thewaver/ss-components-vue";
import type { Toast } from "@thewaver/ss-components-vue";
import { OUTSIDE_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import { StoreUtils } from "@thewaver/ss-utils";

import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";

const DURATION_MS = 8000;

const queue = StoreUtils.create<Toast<ToastDefs>[]>([]);

const notifySyncFinished = () => {
    queue.update(
        (prev) =>
            ToastUtils.withRequestedToast(prev, {
                value: { kind: "info", message: OUTSIDE_MESSAGE },
                announcement: OUTSIDE_MESSAGE,
                durationMs: DURATION_MS,
            }).toasts,
    );
};
</script>

<script setup lang="ts">
import { Button, Toasts, useStore } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";

const toasts = useStore(queue);

const setToasts = (next: Toast<ToastDefs>[]) => {
    queue.set(next);
};
</script>

<template>
    <div :class="styles.example">
        <div :class="styles.raiseRow">
            <Button id="sharedQueueRaise" @click="notifySyncFinished">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Finish a sync</PageButtonContent>
                </template>
            </Button>
            <Button id="sharedQueueClear" @click="setToasts([])">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Clear</PageButtonContent>
                </template>
            </Button>
        </div>

        <Toasts :toasts="toasts" ariaLabel="Sync notifications" alignment="middle_right" @update:toasts="setToasts">
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

        <div :class="exampleStyles.exampleReadout" data-readout>{{ `Queued: ${toasts.length}` }}</div>
    </div>
</template>
