<script setup lang="ts">
import { CellAnimationBreakpoints } from "@thewaver/ss-components-vue";
import type { CellAnimationBreakpointDirection } from "@thewaver/ss-components-vue";

import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";

type Props = {
    value: CellAnimationBreakpointDirection;
    setter: (value: CellAnimationBreakpointDirection) => void;
};

defineProps<Props>();
</script>

<template>
    <PageProp
        item-key="direction"
        label="Direction"
        hint="Which way the sweep travels through the lines, and so which lines go first."
    >
        <PageSelectField
            :value="value"
            :values="CellAnimationBreakpoints.DIRECTIONS"
            ariaLabel="Direction"
            @change="setter"
        />
    </PageProp>
</template>
