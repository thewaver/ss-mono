<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs, ToastKind } from "../../../StyledComponents/ToastContent/ToastContentVue.types";

const DURATION_MS = 4000;

const toasts = useToastsContext<ToastDefs>();

const raise = (kind: ToastKind) => {
    toasts.show({
        value: { kind, message: MESSAGES[kind] },
        announcement: MESSAGES[kind],
        durationMs: DURATION_MS,
        ariaLive: kind === "error" ? "assertive" : "polite",
    });
};
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="raiseInfo" @click="raise('info')">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Info</PageButtonContent>
            </template>
        </Button>
        <Button id="raiseSuccess" @click="raise('success')">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Success</PageButtonContent>
            </template>
        </Button>
        <Button id="raiseError" @click="raise('error')">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Error</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
