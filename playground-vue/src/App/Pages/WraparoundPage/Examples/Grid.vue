<script setup lang="ts">
import { Wraparound } from "@thewaver/ss-components-vue";
import { GRID_CELLS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPage.types";

type Props = WraparoundExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.smallStage">
        <Wraparound ariaLabel="Numbered buttons, repeating in every direction">
            <template #renderContent>
                <div :class="styles.gridTile">
                    <button
                        v-for="cell in GRID_CELLS"
                        :key="cell"
                        type="button"
                        :class="styles.gridCell"
                        @click="props.onPress(cell)"
                    >
                        {{ cell }}
                    </button>
                </div>
            </template>
        </Wraparound>
    </div>
</template>
