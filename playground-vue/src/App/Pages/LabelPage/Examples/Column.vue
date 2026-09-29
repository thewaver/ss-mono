<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox, Label } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { LabelExampleProps } from "../LabelPage.types";

const GAP = 5;

type Props = LabelExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Label orientation="vertical" :gap="GAP">
        <PageLabelCaption>Stacked</PageLabelCaption>

        <Checkbox v-model:checked="checked">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>
    </Label>
</template>
