<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";

const DURATION_MS = 4000;

const toasts = useToastsContext<ToastDefs>();

const publish = () => {
    toasts.show({
        value: { kind: "success", message: RIGHT_TO_LEFT_MESSAGE },
        announcement: RIGHT_TO_LEFT_MESSAGE,
        durationMs: DURATION_MS,
    });
};
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="rightToLeftRaise" @click="publish">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Publish</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
