<script setup lang="ts">
import { SliceAnimationBreakpoints } from "@thewaver/ss-components-vue";
import type { SliceAnimationBreakpointDirection } from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";

type Props = {
    value: SliceAnimationBreakpointDirection;
    setter: (value: SliceAnimationBreakpointDirection) => void;
};

defineProps<Props>();
</script>

<template>
    <PageProp item-key="direction" v-bind="ScanlineAnimationKnobs.DIRECTION_TEXT">
        <PageSelectField
            :value="value"
            :values="SliceAnimationBreakpoints.DIRECTIONS"
            ariaLabel="Direction"
            @change="setter"
        />
    </PageProp>
</template>
