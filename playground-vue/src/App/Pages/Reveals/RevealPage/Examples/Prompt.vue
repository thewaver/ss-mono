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
            ariaLabel="A cover that knows when it is being looked under"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <div :class="styles.content">
                    <span :class="styles.contentTitle">The cover knows</span>
                    <span>It is handed whether a reveal is happening, so it can say something different.</span>
                </div>
            </template>

            <template #renderCover="{ isRevealing, maskStyle }">
                <div :class="styles.promptCover" :style="maskStyle">
                    {{ isRevealing ? "found it" : "nothing to see here" }}
                </div>
            </template>
        </Reveal>
    </div>
</template>
