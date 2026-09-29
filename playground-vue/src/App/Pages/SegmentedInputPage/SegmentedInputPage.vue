<script setup lang="ts">
import { shallowRef } from "vue";

import {
    ONE_TIME_CODE_LENGTH,
    RECOVERY_CODE_LENGTH,
} from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import OneTimeCodeExample from "./Examples/OneTimeCode.vue";
import RecoveryCodeExample from "./Examples/RecoveryCode.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SegmentedInputPage/Examples";

const oneTimeCode = shallowRef("");
const recoveryCode = shallowRef("");

const examples: ExampleDefs[] = [
    {
        key: "oneTimeCode",
        name: "One-time code",
        readout: () =>
            `value: "${oneTimeCode.value}" — ${ONE_TIME_CODE_LENGTH} digits in one field; press a cell to put the caret there`,
        path: `${EXAMPLES_ROOT}/OneTimeCode.vue`,
    },
    {
        key: "recoveryCode",
        name: "Letters and digits",
        readout: () =>
            `value: "${recoveryCode.value}" — ${RECOVERY_CODE_LENGTH} cells taking letters and digits, anything else refused`,
        path: `${EXAMPLES_ROOT}/RecoveryCode.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #oneTimeCode>
            <OneTimeCodeExample v-model:value="oneTimeCode" />
        </template>

        <template #recoveryCode>
            <RecoveryCodeExample v-model:value="recoveryCode" />
        </template>
    </PageExamples>
</template>
