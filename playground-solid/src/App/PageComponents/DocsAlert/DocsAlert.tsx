import type { ParentProps } from "solid-js";

import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";

export const PageDocsAlert = (props: ParentProps) => (
    <div class={styles.docsAlertRoot} role={"note"} data-docs-alert>
        <div class={styles.docsAlertContent}>
            <div class={styles.docsAlertLogo}>⚠</div>
            {props.children}
        </div>
    </div>
);
