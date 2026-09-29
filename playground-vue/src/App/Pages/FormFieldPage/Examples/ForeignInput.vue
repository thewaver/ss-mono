<script setup lang="ts">
import { useModel } from "vue";

import { FormFieldVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

const props = defineProps<{ "value": string; "onUpdate:value"?: (value: string) => void }>();

const value = useModel(props, "value");

const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();
</script>

<template>
    <input
        :class="styles.foreignInput"
        :value="value"
        :aria-describedby="ariaDescribedBy"
        @input="(event: Event) => (value = (event.currentTarget as HTMLInputElement).value)"
    />
</template>
