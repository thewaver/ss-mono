<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, OverheadWheel, ProximityEffectUtils } from "@thewaver/ss-components-vue";
import type { WheelController } from "@thewaver/ss-components-vue";
import { PRIZE_WHEEL_RING, pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import PageWheelCenter from "../../../../StyledComponents/WheelContent/PageWheelCenter.vue";
import PageWheelPip from "../../../../StyledComponents/WheelContent/PageWheelPip.vue";
import PageWheelSpin from "../../../../StyledComponents/WheelContent/PageWheelSpin.vue";
import PageWheelStack from "../../../../StyledComponents/WheelContent/PageWheelStack.vue";
import PageWheelWedge from "../../../../StyledComponents/WheelContent/PageWheelWedge.vue";
import type { WheelExampleProps } from "../../Wheels.types";

type Props = WheelExampleProps;

const props = defineProps<Props>();

const targetIndex = useModel(props, "targetIndex");

const controller = shallowRef<WheelController>();

const setController = (next: WheelController) => {
    controller.value = next;
};

const computeSpinTarget = () => pickPrizeIndex(props.wedges.length);

const computeWedgeLabel = (index: number) => `${props.wedges[index]}, ${index + 1} of ${props.wedges.length}`;

const spin = () => {
    controller.value?.spin();
};
</script>

<template>
    <PageWheelStack>
        <OverheadWheel
            v-model:target-index="targetIndex"
            :is-disabled="isDisabled"
            :spin-duration-ms="spinDurationMs"
            :settle-duration-ms="settleDurationMs"
            :rest-duration-ms="restDurationMs"
            :idle-delay-ms="idleDelayMs"
            :compute-spin-defs="computeSpinDefs"
            :wedges="wedges"
            ariaLabel="Prize wheel"
            :compute-layout="PRIZE_WHEEL_RING"
            :compute-effect="ProximityEffectUtils.glow"
            :compute-spin-target="computeSpinTarget"
            :compute-wedge-label="computeWedgeLabel"
            @selected-wedge-change="props.onSelectedWedgeChange"
            @mount="setController"
        >
            <template #renderWedge="{ wedge, state }">
                <PageWheelWedge :state="state">{{ wedge }}</PageWheelWedge>
            </template>
        </OverheadWheel>

        <PageWheelPip side="top" />

        <PageWheelCenter>
            <Button
                id="overheadSpin"
                ariaLabel="Spin the wheel"
                :is-disabled="!controller?.getIsSpinnable()"
                @click="spin"
            >
                <template #renderContent="flags">
                    <PageWheelSpin :flags="flags" :phase="controller?.getPhase()" />
                </template>
            </Button>
        </PageWheelCenter>
    </PageWheelStack>
</template>
