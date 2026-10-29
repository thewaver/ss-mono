<script setup lang="ts">
import { SliceAnimationBreakpoints } from "@thewaver/ss-components-vue";
import type { SliceAnimationBreakpointDirection } from "@thewaver/ss-components-vue";

import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";

type Props = {
    value: SliceAnimationBreakpointDirection;
    setter: (value: SliceAnimationBreakpointDirection) => void;
};

defineProps<Props>();
</script>

<template>
    <PageProp
        item-key="direction"
        controls="Sets SliceAnimationBreakpointOpts.dir"
        label="Direction"
        hint="Which way the sweep travels through the lines, and so which lines go first."
    >
        <PageSelectField
            :value="value"
            :values="SliceAnimationBreakpoints.DIRECTIONS"
            ariaLabel="Direction"
            @change="setter"
        />
    </PageProp>
</template>
