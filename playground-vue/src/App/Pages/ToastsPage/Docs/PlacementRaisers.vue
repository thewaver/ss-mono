<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { BURST_SIZE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";

const DURATION_MS = 4000;

const toasts = useToastsContext<ToastDefs>();

const raise = () => {
    toasts.show({
        value: { kind: "info", message: MESSAGES.info },
        announcement: MESSAGES.info,
        durationMs: DURATION_MS,
    });
};

const raiseBurst = () => {
    for (let index = 0; index < BURST_SIZE; index += 1) raise();
};
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="placementRaise" @click="raise">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Raise one</PageButtonContent>
            </template>
        </Button>
        <Button id="placementBurst" @click="raiseBurst">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Raise {{ BURST_SIZE }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
