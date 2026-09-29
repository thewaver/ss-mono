<script setup lang="ts">
import { RIGHT_TO_LEFT_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import type { TabsExampleProps } from "../TabsPage.types";
import RowExample from "./Row.vue";

type Props = TabsExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div dir="rtl">
        <RowExample
            :selected-value="selectedValue"
            :tabs="RIGHT_TO_LEFT_TABS"
            id-prefix="rtl"
            @selection-change="props.onSelectionChange"
        />
    </div>
</template>
