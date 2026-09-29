<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Corners } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";

defineProps<Props>();

const isArmed = shallowRef(false);

const toggle = () => {
    isArmed.value = !isArmed.value;
};
</script>

<template>
    <div :class="styles.controlRow">
        <Button :is-pressed="isArmed" @click="toggle">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isArmed ? "Armed" : "Arm" }}</PageButtonContent>
            </template>

            <template #renderDecoration="flags">
                <Corners
                    :color="flags.isPressed ? color : TRANSPARENT"
                    :corner-length="cornerLength"
                    :stroke-thickness="strokeThickness"
                    :transition-duration-ms="transitionDurationMs"
                    :visible-corners="visibleCorners"
                />
            </template>
        </Button>
    </div>
</template>
