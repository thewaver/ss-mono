<script setup lang="ts">
import { ALERT_SEVERITY_ICON } from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsAlertProps } from "./DocsAlertVue.types";

const props = defineProps<PageDocsAlertProps>();

const isPreview = useIsPreview();
</script>

<template>
    <div
        v-if="!isPreview"
        :class="styles.docsAlertRoot"
        :style="
            assignInlineVars({
                [styles.backgroundColor]: themeVars.color[props.severity].contrast,
                [styles.color]: themeVars.color[props.severity].main,
            })
        "
        role="note"
        data-docs-alert=""
    >
        <div :class="styles.docsAlertContent">
            <div :class="styles.docsAlertLogo">{{ ALERT_SEVERITY_ICON[props.severity] }}</div>
            <div><slot /></div>
        </div>
    </div>
</template>
