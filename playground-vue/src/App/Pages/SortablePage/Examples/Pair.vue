<script setup lang="ts">
import { useModel } from "vue";

import type { SortableItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.css";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import CardsExample from "./Cards.vue";

type Props = {
    "groupId": string;
    "hand": SortableItem<Card>[];
    "onUpdate:hand"?: (items: SortableItem<Card>[]) => void;
    "board": SortableItem<Card>[];
    "onUpdate:board"?: (items: SortableItem<Card>[]) => void;
    "isBoardLocked"?: boolean;
    "computeCanAccept"?: (value: Card, fromLabel: string) => boolean;
};

const props = defineProps<Props>();

const hand = useModel(props, "hand");
const board = useModel(props, "board");
</script>

<template>
    <div :class="styles.sortablePair">
        <div :class="styles.sortableColumn">
            <div :class="styles.sortableCaption">Hand</div>

            <CardsExample v-model:items="hand" :group-id="groupId" ariaLabel="Hand" empty-text="No cards" />
        </div>

        <div :class="styles.sortableColumn">
            <div :class="styles.sortableCaption">Board</div>

            <CardsExample
                v-model:items="board"
                :group-id="groupId"
                ariaLabel="Board"
                empty-text="Play a card here"
                :is-locked="isBoardLocked ?? false"
                :compute-can-accept="computeCanAccept"
            />
        </div>
    </div>
</template>
