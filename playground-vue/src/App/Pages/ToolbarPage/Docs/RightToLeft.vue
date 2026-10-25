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

const ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align right" },
    { value: "Align center" },
    { value: "Bullets" },
    { value: "Numbering" },
];

const lastRun = shallowRef<string>();
</script>

<template>
    <div dir="rtl" :class="styles.docsDirectionBox">
        <ResizableBar>
            <Toolbar
                :actions="ACTIONS"
                ariaLabel="Formatting"
                overflowAriaLabel="More formatting actions"
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
        </ResizableBar>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun ?? "nothing yet"}` }}</div>
</template>
