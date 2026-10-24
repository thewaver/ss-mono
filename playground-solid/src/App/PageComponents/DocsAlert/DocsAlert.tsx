import type { ParentProps } from "solid-js";

import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";

import { useIsPreview } from "../Preview/Preview.context";

export const PageDocsAlert = (props: ParentProps) => {
    if (useIsPreview()) return null;

    return (
        <div class={styles.docsAlertRoot} role={"note"} data-docs-alert>
            <div class={styles.docsAlertContent}>
                <div class={styles.docsAlertLogo}>⚠</div>
                {props.children}
            </div>
        </div>
    );
};
