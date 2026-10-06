<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { Button, Die } from "@thewaver/ss-components-vue";
import type { DieController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageDieFace from "../../../StyledComponents/DieContent/DieContent.vue";
import type { DieExampleProps } from "../DiePage.types";

const FIRST_NUMBER = 1;

type Props = DieExampleProps;

const props = defineProps<Props>();

const face = useModel(props, "face");

const controller = shallowRef<DieController>();

const isRolling = computed(() => controller.value?.getIsRolling() ?? true);

const computeFaceLabel = (index: number) => `${index + FIRST_NUMBER}`;

const computeRollTarget = () => Math.floor(Math.random() * props.shape.faces.length);

const roll = () => {
    controller.value?.roll();
};
</script>

<template>
    <div :class="styles.stage">
        <Die
            v-model:face="face"
            :shape="shape"
            :size="size"
            :roll-duration-ms="rollDurationMs"
            :settle-duration-ms="settleDurationMs"
            :tumble-count="tumbleCount"
            ariaLabel="A die"
            :compute-face-label="computeFaceLabel"
            :compute-roll-target="computeRollTarget"
            @mount="(next: DieController) => (controller = next)"
        >
            <template #renderFace="{ index, state }">
                <PageDieFace :state="state" :label="`${index + FIRST_NUMBER}`" />
            </template>
        </Die>

        <Button id="dieRoll" :is-disabled="isRolling" @click="roll">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Roll</PageControlButtonContent>
            </template>
        </Button>
    </div>
</template>
