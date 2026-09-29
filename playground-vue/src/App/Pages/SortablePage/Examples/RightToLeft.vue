<script setup lang="ts">
import { useModel } from "vue";

import type { SortableItem } from "@thewaver/ss-components-vue";
import type { Card } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.types";

import PageSortableRoom from "../../../StyledComponents/SortableContent/PageSortableRoom.vue";
import CardsExample from "./Cards.vue";

type Props = {
    "items": SortableItem<Card>[];
    "onUpdate:items"?: (items: SortableItem<Card>[]) => void;
};

const props = defineProps<Props>();

const items = useModel(props, "items");
</script>

<template>
    <div dir="rtl">
        <PageSortableRoom>
            <CardsExample
                v-model:items="items"
                group-id="rightToLeft"
                ariaLabel="Row in a right-to-left box"
                empty-text="No cards"
                orientation="horizontal"
            />
        </PageSortableRoom>
    </div>
</template>
