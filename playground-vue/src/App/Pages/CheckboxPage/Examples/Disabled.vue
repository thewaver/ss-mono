<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

type Props = CheckboxExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Checkbox v-model:checked="checked" ariaLabel="Disabled checkbox" is-disabled>
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags" />
        </template>
    </Checkbox>
</template>
