<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, CornerPin, QuadWarpUtils } from "@thewaver/ss-components-vue";
import { GRIP_LABELS } from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerPinPage/CornerPinPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CornerPinExampleProps } from "../CornerPinPageVue.types";

type Props = CornerPinExampleProps;

defineProps<Props>();

const corners = shallowRef(QuadWarpUtils.RESTING_CORNERS);

const reset = () => {
    corners.value = QuadWarpUtils.RESTING_CORNERS;
};
</script>

<template>
    <div :class="styles.stage">
        <CornerPin
            v-model:corners="corners"
            :reach-ratio="reachRatio"
            :grip-labels="GRIP_LABELS"
            ariaLabel="Card corners"
        >
            <template #renderGrip="{ isPicked, isDragging, focusVisibleAxis }">
                <div
                    :class="[
                        styles.grip,
                        isPicked && styles.isPicked,
                        isDragging && styles.isDragging,
                        focusVisibleAxis !== undefined && styles.isFocused,
                    ]"
                />
            </template>

            <div :class="styles.card">
                <div>Pin my corners</div>

                <div>Drag a grip, or tap it and then tap where it should go.</div>
            </div>
        </CornerPin>

        <Button id="cornerPinReset" @click="reset">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Reset</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
