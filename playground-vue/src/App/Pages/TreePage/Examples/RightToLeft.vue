<script setup lang="ts">
import { useModel } from "vue";

import type { TreeExampleProps } from "../TreePage.types";
import FilesExample from "./Files.vue";

type Props = TreeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");
</script>

<template>
    <div dir="rtl">
        <FilesExample v-model:value="value" v-model:expanded="expanded" />
    </div>
</template>
