<script setup lang="ts">
import { PlacementLayoutUtils, Toolbar } from "@thewaver/ss-components-vue";
import type { ArcDefs, ToolbarAction } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarExampleProps } from "../ToolbarPage.types";
import ToolbarPopup from "../ToolbarPopup.vue";

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Select" },
    { value: "Brush" },
    { value: "Erase" },
    { value: "Fill" },
    { value: "Text" },
    { value: "Shape" },
    { value: "Crop" },
    { value: "Zoom" },
];

const PALETTE_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 70,
    itemWidthRatio: 0.3542,
    itemHeightRatio: 0.4706,
};

const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

const PALETTE_WIDTH = "390px";

type Props = ToolbarExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :style="{ width: PALETTE_WIDTH }">
        <Toolbar
            :actions="ACTIONS"
            ariaLabel="Tools"
            overflow-aria-label="More tools"
            :compute-layout="PALETTE_LAYOUT"
            @activate="props.onActivate"
        >
            <template #renderAction="{ action, flags }">
                <PageButtonContent :flags="flags">{{ action.value }}</PageButtonContent>
            </template>

            <template #renderOverflowTrigger="flags">
                <PageMenuTriggerContent :flags="flags">More</PageMenuTriggerContent>
            </template>

            <template #renderOverflowItem="{ item, flags }">
                <ToolbarOverflowItem :item="item" :flags="flags" />
            </template>

            <template #renderOverflowPopup="{ renderItems, visibilityTarget, transitionDurationMs, placement }">
                <ToolbarPopup
                    :render-items="renderItems"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :placement="placement"
                />
            </template>
        </Toolbar>
    </div>
</template>
