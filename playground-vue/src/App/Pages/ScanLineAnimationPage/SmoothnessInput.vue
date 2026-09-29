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
    <PageProp
        item-key="smoothness01"
        label="Smoothness (0-1)"
        hint="How much one line's movement overlaps its neighbors'. 0 makes each line wait its turn; 1 blurs them into one sweep."
    >
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
