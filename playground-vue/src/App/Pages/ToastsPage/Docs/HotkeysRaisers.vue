<script setup lang="ts">
import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import { HOTKEYS_MESSAGE } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";

const toasts = useToastsContext<ToastDefs>();

const raise = () => {
    toasts.show({
        value: { kind: "info", message: HOTKEYS_MESSAGE },
        announcement: HOTKEYS_MESSAGE,
    });
};
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="hotkeysRaise" @click="raise">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Raise</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
