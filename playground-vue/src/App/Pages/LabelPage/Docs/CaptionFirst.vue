<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, Toggle } from "@thewaver/ss-components-vue";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";

const checked = shallowRef(true);
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
