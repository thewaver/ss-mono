<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, Die } from "@thewaver/ss-components-vue";
import type { DieController, RollerDirection } from "@thewaver/ss-components-vue";
import {
    ICON_CLOUD_EMPTY_LABEL,
    ICON_CLOUD_ICONS,
    ICON_CLOUD_STEPS,
} from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageDieIcon from "../../../StyledComponents/DieContent/PageDieIcon.vue";
import type { IconCloudExampleProps } from "../DiePage.types";

type Props = IconCloudExampleProps;

const props = defineProps<Props>();

const face = useModel(props, "face");

const autoSpin = useModel(props, "autoSpin");

const controller = shallowRef<DieController>();

const computeFaceLabel = (index: number) => ICON_CLOUD_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL;

const togglePlayback = () => {
    autoSpin.value = !autoSpin.value;
};

const stepCloud = (direction: RollerDirection) => {
    controller.value?.step(direction);
};
</script>

<template>
    <div :class="styles.stage">
        <Die
            v-model:face="face"
            v-model:autoSpin="autoSpin"
            :shape="shape"
            :size="size"
            :idle-delay-ms="idleDelayMs"
            :settle-duration-ms="settleDurationMs"
            :momentum-ms="momentumMs"
            is-movable
            is-see-through
            ariaLabel="A cloud of icons"
            :compute-face-label="computeFaceLabel"
            @mount="(next: DieController) => (controller = next)"
        >
            <template #renderFace="{ index, state }">
                <PageDieIcon :state="state" :icon="ICON_CLOUD_ICONS[index]?.icon ?? ''" />
            </template>
        </Die>

        <div :class="styles.controls">
            <Button id="dieCloudPlayback" @click="togglePlayback">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ autoSpin ? "Pause" : "Play" }}</PageButtonContent>
                </template>
            </Button>

            <Button
                v-for="step in ICON_CLOUD_STEPS"
                :id="`dieCloud${step.label}`"
                :key="step.direction"
                @click="stepCloud(step.direction)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ step.label }}</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
