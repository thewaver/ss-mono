<script setup lang="ts">
import { shallowRef } from "vue";

import { Toolbar } from "@thewaver/ss-components-vue";
import type { ToolbarAction } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PALETTE_LAYOUT, PALETTE_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
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

const lastRun = shallowRef<string>();
</script>

<template>
    <div :style="{ width: PALETTE_WIDTH }">
        <Toolbar
            :actions="ACTIONS"
            ariaLabel="Tools"
            overflowAriaLabel="More tools"
            :compute-layout="PALETTE_LAYOUT"
            @activate="(value: string) => (lastRun = value)"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun ?? "nothing yet"}` }}</div>
</template>
