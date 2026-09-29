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
            ariaLabel="A torch over a hidden note"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <div :class="styles.content">
                    <span :class="styles.contentTitle">Under the cover</span>
                    <span>The cover is whatever you pass; the component only cuts the hole in it.</span>
                    <span>The hole is a mask, so the cover keeps its own paint everywhere else.</span>
                </div>
            </template>

            <template #renderCover="{ maskStyle }">
                <div :class="styles.solidCover" :style="maskStyle">Move the pointer over me</div>
            </template>
        </Reveal>
    </div>
</template>
