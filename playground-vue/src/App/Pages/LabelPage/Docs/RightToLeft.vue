<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox, Label } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";

const checked = shallowRef(false);
</script>

<template>
    <div dir="rtl">
        <Label>
            <Checkbox v-model:checked="checked">
                <template #renderContent="flags">
                    <PageCheckboxContent :flags="flags" />
                </template>
            </Checkbox>

            <PageLabelCaption>Remember me</PageLabelCaption>
        </Label>
    </div>
</template>
