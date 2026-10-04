<script setup lang="ts">
import { Lens } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";

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
            ariaLabel="A magnifying lens over a page of small print"
            :compute-points="computePoints"
        >
            <template #renderContent>
                <div :class="styles.print">
                    <span :class="styles.printTitle">The small print</span>
                    <span :class="styles.finePrint">
                        The lens draws the content a second time, larger, and shows that copy only inside the window
                        that follows the pointer. The copy is scaled about the window's center, so the word under the
                        middle of the lens is the word under the pointer.
                    </span>
                    <span :class="styles.finePrint">
                        Only the content underneath is real: the copy is hidden from screen readers and cannot be
                        reached with Tab. Tab to the lens and it opens at the center; the arrow keys move it.
                    </span>
                </div>
            </template>
        </Lens>
    </div>
</template>
