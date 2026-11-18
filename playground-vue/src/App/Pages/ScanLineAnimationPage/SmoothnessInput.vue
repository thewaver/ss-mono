<script setup lang="ts">
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";

type Props = {
    value: number;
    setter: (value: number) => void;
};

defineProps<Props>();
</script>

<template>
    <PageProp item-key="smoothness01" v-bind="ScanlineAnimationKnobs.SMOOTHNESS01_TEXT">
        <PageNumberField
            :value="value"
            :min="ScanlineAnimationKnobs.MIN_SMOOTHNESS"
            :max="ScanlineAnimationKnobs.MAX_SMOOTHNESS"
            :step="ScanlineAnimationKnobs.SMOOTHNESS_STEP"
            ariaLabel="Smoothness"
            @input="setter"
        />
    </PageProp>
</template>
