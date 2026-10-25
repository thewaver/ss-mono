<script setup lang="ts">
import { shallowRef } from "vue";

import { Toolbar } from "@thewaver/ss-components-vue";
import type { ToolbarAction } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import ToolbarPopup from "../ToolbarPopup.vue";
import ResizableBar from "./ResizableBar.vue";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

const pressedValues = shallowRef<string[]>([]);
</script>

<template>
    <ResizableBar>
        <Toolbar
            v-model:pressedValues="pressedValues"
            :actions="ACTIONS"
            ariaLabel="Text style"
            overflowAriaLabel="More text styles"
            @activate="() => {}"
        >
            <template #renderAction="{ action, flags }">
                <PageButtonContent :flags="flags">
                    <span :class="[styles.pressedMark, flags.isPressed && styles.isPressed]">{{ action.value }}</span>
                </PageButtonContent>
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
    </ResizableBar>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Pressed: ${pressedValues.join(", ") || "nothing"}` }}
    </div>
</template>
