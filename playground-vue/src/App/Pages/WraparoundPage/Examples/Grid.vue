<script setup lang="ts">
import { Wraparound } from "@thewaver/ss-components-vue";
import {
    GRID_CELLS,
    NUMBERED_BUTTONS_REPEATING_EVERY_LABEL,
} from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPageVue.types";

type Props = WraparoundExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.smallStage">
        <Wraparound :ariaLabel="NUMBERED_BUTTONS_REPEATING_EVERY_LABEL">
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
