import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";

import { useIsPreview } from "../Preview/Preview.context";

export const PageDocsAlert = (props: PropsWithChildren) => {
    if (useIsPreview()) return null;

    return (
        <div className={styles.docsAlertRoot} role={"note"} data-docs-alert>
            <div className={styles.docsAlertContent}>
                <div className={styles.docsAlertLogo}>⚠</div>
                {props.children}
            </div>
        </div>
    );
};
