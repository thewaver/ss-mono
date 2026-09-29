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
        <PageProp
            item-key="isUpright"
            label="Stays upright"
            hint="Every press turns the box a quarter turn about the screen's own axis, as you see it, and the face it lands on is then spun until it reads the right way up. Off, the box goes back to reading the two counts as a pose, where the far side shows upside down once it has been tipped over the top."
        >
            <PageCheckField
                :value="isUpright"
                ariaLabel="Stays upright"
                @change="(value: boolean) => (isUpright = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDraggable"
            label="Draggable"
            hint="Lets the box be turned by dragging it. It follows the pointer, and on release settles on the nearest face, writing the turns to the same two counts the buttons do."
        >
            <PageCheckField
                :value="isDraggable"
                ariaLabel="Draggable"
                @change="(value: boolean) => (isDraggable = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
