<script setup lang="ts">
import { PaintedText, ProximityText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageVue.types";

type Props = ProximityTextExampleProps;

defineProps<Props>();

const computeFillDefs = () => [{ color: "currentColor" }];
</script>

<template>
    <div :class="styles.variableText">
        <ProximityText :reach-px="reachPx" :is-disabled="isDisabled">
            <PaintedText :compute-fill-defs="computeFillDefs">Painted letters push their neighbors along</PaintedText>
        </ProximityText>
    </div>
</template>
