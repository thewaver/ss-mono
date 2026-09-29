<script setup lang="ts">
import { Reveal } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.css";

import type { RevealExampleProps } from "../RevealExample.types";

type Props = RevealExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.root">
        <Reveal
            :radius="radius"
            :softness="softness"
            :step-size="stepSize"
            :join-radii="joinRadii"
            :lame-exponents="lameExponents"
            :is-disabled="isDisabled"
            ariaLabel="A frosted cover over a note"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <div :class="styles.content">
                    <span :class="styles.contentTitle">Frosted, not opaque</span>
                    <span>A cover that blurs rather than hides means the hole sharpens instead of uncovering.</span>
                    <span>Same component, different cover.</span>
                </div>
            </template>

            <template #renderCover="{ maskStyle }">
                <div :class="styles.frostedCover" :style="maskStyle" />
            </template>
        </Reveal>
    </div>
</template>
