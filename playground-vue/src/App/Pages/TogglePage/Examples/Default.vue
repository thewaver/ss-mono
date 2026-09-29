<script setup lang="ts">
import { useModel } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Toggle v-model:checked="checked" ariaLabel="Default toggle">
        <template #renderContent="flags">
            <PageToggleContent :flags="flags" />
        </template>
    </Toggle>
</template>
