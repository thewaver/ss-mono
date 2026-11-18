<script setup lang="ts">
import { Lens } from "@thewaver/ss-components-vue";
import { MAGNIFYING_LENS_OVER_PICTURE_LABEL } from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

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
            :ariaLabel="MAGNIFYING_LENS_OVER_PICTURE_LABEL"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <img :class="styles.photo" :src="knight_profile" alt="A knight in armor" />
            </template>
        </Lens>
    </div>
</template>
