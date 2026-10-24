<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";

import { useIsPreview } from "../Preview/Preview.context";

const isPreview = useIsPreview();
</script>

<template>
    <div v-if="!isPreview" :class="styles.docsAlertRoot" role="note" data-docs-alert="">
        <div :class="styles.docsAlertContent">
            <div :class="styles.docsAlertLogo">⚠</div>
            <slot />
        </div>
    </div>
</template>
