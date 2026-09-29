<script setup lang="ts">
import { useModel } from "vue";

import { Label, Toggle } from "@thewaver/ss-components-vue";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import type { LabelExampleProps } from "../LabelPage.types";

type Props = LabelExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
</script>

<template>
    <Label>
        <PageLabelCaption>Send notifications</PageLabelCaption>

        <Toggle v-model:checked="checked">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags" />
            </template>
        </Toggle>
    </Label>
</template>
