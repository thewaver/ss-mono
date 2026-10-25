<script setup lang="ts">
import { shallowRef } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";

const checked = shallowRef(false);
</script>

<template>
    <div dir="rtl">
        <Toggle v-model:checked="checked" ariaLabel="Send notifications">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags">Send notifications</PageToggleContent>
            </template>
        </Toggle>
    </div>
</template>
