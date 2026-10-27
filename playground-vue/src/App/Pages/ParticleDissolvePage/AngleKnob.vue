<script setup lang="ts">
import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";

type Props = {
    value: number;
    onInput: (value: number) => void;
};

defineProps<Props>();
</script>

<template>
    <PageProp
        item-key="angleDegrees"
        controls="Sets ParticleDissolveProps.angleDegrees"
        label="Angle (degrees)"
        hint="The direction the edge travels: 0 sweeps up, 90 to the right, 180 down."
    >
        <PageNumberField
            :value="value"
            :min="ParticleDissolveKnobs.MIN_ANGLE"
            :max="ParticleDissolveKnobs.MAX_ANGLE"
            :step="ParticleDissolveKnobs.ANGLE_STEP"
            :width="FIELD_WIDTH"
            ariaLabel="Angle in degrees"
            @input="onInput"
        />
    </PageProp>
</template>
