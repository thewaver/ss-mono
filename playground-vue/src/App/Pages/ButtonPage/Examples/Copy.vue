<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

import { Button, LiveAnnouncerUtils } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ButtonCopyExampleProps } from "../ButtonPage.types";

const COPIED_MS = 2000;
const COPIED_ANNOUNCEMENT = "Copied to the clipboard";
const FAILED_ANNOUNCEMENT = "Could not copy to the clipboard";

type Props = ButtonCopyExampleProps;

const props = defineProps<Props>();

const isCopied = shallowRef(false);

let copiedTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
    LiveAnnouncerUtils.reserve("polite");
    LiveAnnouncerUtils.reserve("assertive");
});

onBeforeUnmount(() => clearTimeout(copiedTimer));

const copy = () =>
    navigator.clipboard.writeText(props.text).then(
        () => {
            clearTimeout(copiedTimer);
            isCopied.value = true;
            LiveAnnouncerUtils.announce(COPIED_ANNOUNCEMENT);
            props.onCopy();

            copiedTimer = setTimeout(() => (isCopied.value = false), COPIED_MS);
        },
        () => {
            LiveAnnouncerUtils.announce(FAILED_ANNOUNCEMENT, "assertive");
        },
    );
</script>

<template>
    <PageControlRow>
        <code>{{ text }}</code>

        <Button @click="copy">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{
                    flags.isPending ? "Copying…" : isCopied ? "Copied" : "Copy"
                }}</PageButtonContent>
            </template>
        </Button>
    </PageControlRow>
</template>
