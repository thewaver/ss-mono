<script setup lang="ts">
import { Progress } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.css";

import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.vue";

const RATIO = 0.4;
</script>

<template>
    <div dir="rtl" :class="styles.docsDirectionBox">
        <Progress :value="RATIO" ariaLabel="Setup progress">
            <template #renderContent="state">
                <PageProgressContent :state="state" />
            </template>
        </Progress>
    </div>
</template>
