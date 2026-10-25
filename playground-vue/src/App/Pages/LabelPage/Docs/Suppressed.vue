<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, Label } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";

const checked = shallowRef(false);
</script>

<template>
    <Label>
        <Checkbox v-model:checked="checked" ariaLabel="Announced as something else">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
    </Label>
</template>
