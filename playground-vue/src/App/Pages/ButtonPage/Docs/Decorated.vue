<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, CornerHighlight, type InteractionActivation } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageRipple from "../../../StyledComponents/Ripple/Ripple.vue";

const isPressed = shallowRef(false);
const activation = shallowRef<InteractionActivation>();

const toggle = () => {
    isPressed.value = !isPressed.value;
};
</script>

<template>
    <Button :is-pressed="isPressed" @activation="(next: InteractionActivation) => (activation = next)" @click="toggle">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Toggle Me</PageButtonContent>
        </template>

        <template #renderDecoration="flags">
            <CornerHighlight :color="flags.isPressed ? 'yellow' : 'transparent'" />
            <PageRipple :activation="activation" color="yellow" />
        </template>
    </Button>
</template>
