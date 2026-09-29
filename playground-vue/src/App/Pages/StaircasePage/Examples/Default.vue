<script setup lang="ts">
import { Staircase, StaircaseIndents } from "@thewaver/ss-components-vue";
import type { StaircaseStepDefs } from "@thewaver/ss-components-vue";

import PageStaircaseStep from "../../../StyledComponents/StaircaseContent/StaircaseContent.vue";
import type { StaircaseExampleProps } from "../StaircasePage.types";

type Props = StaircaseExampleProps;

const props = defineProps<Props>();

const computeStepIndent = (defs: StaircaseStepDefs) => StaircaseIndents.SAMPLE_INDENTS[props.indentKey](defs);
</script>

<template>
    <Staircase :steps="steps" :indent="indent" :gap="gap" :dir="dir" :compute-step-indent="computeStepIndent">
        <template #renderStep="{ step, state }">
            <PageStaircaseStep :state="state">{{ step }}</PageStaircaseStep>
        </template>
    </Staircase>
</template>
