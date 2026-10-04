<script setup lang="ts">
import { ProximityText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageVue.types";

type Props = ProximityTextExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.variableText">
        <ProximityText :reach-px="reachPx" :is-disabled="isDisabled"
            >Move the pointer over these words and watch each letter thicken as it comes near, pushing the rest of its
            line along without ever moving a line break.</ProximityText
        >
    </div>
</template>
