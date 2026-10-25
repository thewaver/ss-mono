<script setup lang="ts">
import { shallowRef } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const checked = shallowRef(true);
</script>

<template>
    <div dir="rtl">
        <Checkbox v-model:checked="checked" ariaLabel="Remember me">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">Remember me</PageCheckboxContent>
            </template>
        </Checkbox>
    </div>
</template>
