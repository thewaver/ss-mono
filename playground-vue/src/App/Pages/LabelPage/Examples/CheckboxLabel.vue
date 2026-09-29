<script setup lang="ts">
import { useModel } from "vue";

import { Checkbox, Label } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Label>
        <Checkbox v-model:checked="checked">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <PageLabelCaption id="rememberCaption">Remember me</PageLabelCaption>
    </Label>
</template>
