<script setup lang="ts">
import { h } from "vue";

import { Button, useToastsContext } from "@thewaver/ss-components-vue";
import type { InteractionFlags } from "@thewaver/ss-components-vue";
import { DRAFT_DELETED_MESSAGE, MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentVue.types";
import type { ToastsOwnPainterRaisersProps } from "../ToastsPageVue.types";

const DURATION_MS = 4000;
const UNDO_DURATION_MS = 8000;

const props = defineProps<ToastsOwnPainterRaisersProps>();

const toasts = useToastsContext<ToastDefs>();

const save = () => {
    toasts.show({
        value: { kind: "success", message: MESSAGES.success },
        announcement: MESSAGES.success,
        durationMs: DURATION_MS,
    });
};

const deleteDraft = () => {
    if (!props.hasDraft) return;

    props.onDelete();
    toasts.show({
        value: { kind: "error", message: DRAFT_DELETED_MESSAGE },
        announcement: DRAFT_DELETED_MESSAGE,
        durationMs: UNDO_DURATION_MS,
        renderToast: ({ toast, visibilityTarget, transitionDurationMs, state }) =>
            h(
                PageToastContent,
                {
                    toast,
                    state,
                    animation: "slide",
                    visibilityTarget,
                    transitionDurationMs,
                    onDismiss: () => toasts.dismiss(toast.id),
                },
                () =>
                    h("div", { class: styles.raiseRow }, [
                        h(
                            Button,
                            {
                                id: "undoDelete",
                                onClick: () => {
                                    props.onRestore();
                                    toasts.dismiss(toast.id);
                                },
                            },
                            {
                                renderContent: (flags: InteractionFlags) =>
                                    h(PageButtonContent, { flags }, () => "Undo"),
                            },
                        ),
                    ]),
            ),
    });
};
</script>

<template>
    <div :class="styles.raiseRow">
        <Button id="ownPainterSave" @click="save">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Save</PageButtonContent>
            </template>
        </Button>
        <Button id="ownPainterDelete" @click="deleteDraft">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Delete draft</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
