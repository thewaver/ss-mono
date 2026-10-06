<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, DrumWheel } from "@thewaver/ss-components-vue";
import type { WheelController } from "@thewaver/ss-components-vue";
import { pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";
import type { Size2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageWheelBar from "../../../../StyledComponents/WheelContent/PageWheelBar.vue";
import PageWheelCard from "../../../../StyledComponents/WheelContent/PageWheelCard.vue";
import PageWheelMount from "../../../../StyledComponents/WheelContent/PageWheelMount.vue";
import PageWheelPip from "../../../../StyledComponents/WheelContent/PageWheelPip.vue";
import type { WheelExampleProps } from "../../Wheels.types";

const WEDGE_SIZE: Size2d = { width: 160, height: 64 };

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
    <PageMeasureBox>
        <PageWheelMount>
            <DrumWheel
                v-model:target-index="targetIndex"
                :is-disabled="isDisabled"
                :spin-duration-ms="spinDurationMs"
                :settle-duration-ms="settleDurationMs"
                :rest-duration-ms="restDurationMs"
                :idle-delay-ms="idleDelayMs"
                :compute-spin-defs="computeSpinDefs"
                :wedges="wedges"
                axis="row"
                :wedge-size="WEDGE_SIZE"
                ariaLabel="Prize drum, turning sideways"
                :compute-spin-target="computeSpinTarget"
                :compute-wedge-label="computeWedgeLabel"
                @selected-wedge-change="props.onSelectedWedgeChange"
                @mount="setController"
            >
                <template #renderWedge="{ wedge, state }">
                    <PageWheelCard :state="state">{{ wedge }}</PageWheelCard>
                </template>

                <template #renderWedgeBack="{ state }">
                    <PageWheelCard :state="state" />
                </template>
            </DrumWheel>

            <PageWheelPip side="top" />
        </PageWheelMount>
    </PageMeasureBox>

    <PageWheelBar>
        <Button id="sidewaysSpin" ariaLabel="Spin the wheel" :is-disabled="!controller?.getIsSpinnable()" @click="spin">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Spin</PageControlButtonContent>
            </template>
        </Button>
    </PageWheelBar>
</template>
