<script setup lang="ts">
import { computed } from "vue";

import { Toasts } from "@thewaver/ss-components-vue";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastsPlacementDocsExampleProps } from "../ToastsPageVue.types";
import PlacementRaisers from "./PlacementRaisers.vue";

const props = defineProps<ToastsPlacementDocsExampleProps>();

const margins = computed(() => ({
    marginTop: props.margin,
    marginRight: props.margin,
    marginBottom: props.margin,
    marginLeft: props.margin,
}));
</script>

<template>
    <Toasts
        ariaLabel="Placement notifications"
        :alignment="alignment"
        :flex-direction="flexDirection"
        :gap="gap"
        :margins="margins"
    >
        <PlacementRaisers />

        <template #renderToast="{ toast, visibilityTarget, transitionDurationMs, state, dismiss }">
            <PageToastContent
                :toast="toast"
                :state="state"
                :stacking="stacking"
                :flex-direction="flexDirection"
                :gap="gap"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                @dismiss="dismiss"
            />
        </template>
    </Toasts>
</template>
