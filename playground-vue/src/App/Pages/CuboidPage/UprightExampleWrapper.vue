<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { CuboidUprightExampleProps } from "./CuboidPage.types";
import UprightExample from "./Examples/Upright.vue";

type Props = Omit<CuboidUprightExampleProps, "isUpright" | "isDraggable">;

const props = defineProps<Props>();

const yaw = useModel(props, "yaw");
const pitch = useModel(props, "pitch");
const controller = useModel(props, "controller");

const isUpright = shallowRef(CuboidKnobs.STARTING_IS_UPRIGHT);
const isDraggable = shallowRef(CuboidKnobs.STARTING_IS_DRAGGABLE);
</script>

<template>
    <UprightExample
        v-model:yaw="yaw"
        v-model:pitch="pitch"
        v-model:controller="controller"
        :size="size"
        :transition-duration-ms="transitionDurationMs"
        :is-upright="isUpright"
        :is-draggable="isDraggable"
    />

    <PageExampleKnobs>
        <PageProp item-key="isUpright" v-bind="CuboidKnobs.IS_UPRIGHT_TEXT">
            <PageCheckField
                :value="isUpright"
                ariaLabel="Stays upright"
                @change="(value: boolean) => (isUpright = value)"
            />
        </PageProp>

        <PageProp item-key="isDraggable" v-bind="CuboidKnobs.IS_DRAGGABLE_TEXT">
            <PageCheckField
                :value="isDraggable"
                ariaLabel="Draggable"
                @change="(value: boolean) => (isDraggable = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
