<script setup lang="ts">
import { Lens } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import type { LensExampleProps } from "../LensPage.types";

type Props = LensExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.root">
        <Lens
            :zoom="zoom"
            :radius="radius"
            :softness="softness"
            :step-size="stepSize"
            :join-radii="joinRadii"
            :lame-exponents="lameExponents"
            :is-disabled="isDisabled"
            ariaLabel="A magnifying lens over a picture of a knight"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <img :class="styles.photo" :src="knight" alt="A knight in armor" />
            </template>
        </Lens>
    </div>
</template>
