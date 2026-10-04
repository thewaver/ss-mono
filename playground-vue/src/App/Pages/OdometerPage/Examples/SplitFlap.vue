<script setup lang="ts">
import { Odometer } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 40, height: 60 };

type Props = OdometerExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.board">
        <Odometer
            :text="text"
            mechanism="splitFlap"
            :digit-size="DIGIT_SIZE"
            :turn-duration-ms="turnDurationMs"
            :cascade-delay-ms="cascadeDelayMs"
            ariaLabel="Departures"
        >
            <template #renderDigit="{ digit }">
                <div :class="styles.flapTile">{{ digit }}</div>
            </template>

            <template #renderFixed="{ character }">
                <div :class="styles.flapFixed">{{ character }}</div>
            </template>
        </Odometer>
    </div>
</template>
