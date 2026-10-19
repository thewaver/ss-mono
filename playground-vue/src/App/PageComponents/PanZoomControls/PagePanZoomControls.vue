<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";
import { PAN_ZOOM_ACTIONS } from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.css";
import type { PanZoomAction } from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.types";

import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { PagePanZoomControlsProps } from "./PanZoomControlsVue.types";

const props = defineProps<PagePanZoomControlsProps>();

const act = (action: PanZoomAction) => {
    if (!props.controller) return;

    if (action.kind === "zoom") props.controller.zoomBy(action.factor);
    else props.controller.panBy(action.ratio);
};
</script>

<template>
    <div :class="styles.panZoomControls">
        <Button
            v-for="action in PAN_ZOOM_ACTIONS"
            :id="`${idPrefix}${action.key}`"
            :key="action.key"
            :ariaLabel="action.label"
            @click="act(action)"
        >
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags" :glyph="action.glyph" />
            </template>
        </Button>
    </div>
</template>
