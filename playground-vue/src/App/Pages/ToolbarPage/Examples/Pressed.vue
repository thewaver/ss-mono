<script setup lang="ts">
import { useModel } from "vue";

import { Toolbar } from "@thewaver/ss-components-vue";
import type { ToolbarAction } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import ToolbarOverflowItem from "../ToolbarOverflowItem.vue";
import type { ToolbarPressedExampleProps } from "../ToolbarPage.types";
import ToolbarPopup from "../ToolbarPopup.vue";

const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

type Props = ToolbarPressedExampleProps;

const props = defineProps<Props>();

const pressedValues = useModel(props, "pressedValues");
</script>

<template>
    <Toolbar
        v-model:pressed-values="pressedValues"
        :actions="ACTIONS"
        :gap="gap"
        ariaLabel="Text style"
        overflow-aria-label="More text styles"
        @activate="props.onActivate"
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
</template>
