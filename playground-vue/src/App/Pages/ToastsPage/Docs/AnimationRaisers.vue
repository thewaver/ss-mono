<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
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
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="animationRaise" @click="raise">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Raise one</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
