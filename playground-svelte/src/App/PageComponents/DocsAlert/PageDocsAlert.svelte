<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import { ALERT_SEVERITY_ICON } from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.const";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getIsPreview } from "../Preview/Preview.context";
    import type { PageDocsAlertProps } from "./DocsAlertSvelte.types";

    let props: PageDocsAlertProps = $props();

    const isPreview = getIsPreview();
</script>

{#if !isPreview}
    <div
        class={styles.docsAlertRoot}
        style={toStyle(
            assignInlineVars({
                [styles.backgroundColor]: themeVars.color[props.severity].contrast,
                [styles.color]: themeVars.color[props.severity].main,
            }),
        )}
        role="note"
        data-docs-alert=""
    >
        <div class={styles.docsAlertContent}>
            <div class={styles.docsAlertLogo}>{ALERT_SEVERITY_ICON[props.severity]}</div>
            <div>{@render props.children?.()}</div>
        </div>
    </div>
{/if}
