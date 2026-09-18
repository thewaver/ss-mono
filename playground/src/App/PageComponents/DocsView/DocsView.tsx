import { access } from "@thewaver/ss-components";

import type { PageDocsViewProps } from "./DocsView.types";

import * as styles from "./DocsView.css";

export const PageDocsView = (props: PageDocsViewProps) => {
    return (
        <div class={styles.docsView} data-view={"docs"}>
            <p class={styles.docsLead}>{access(props.description)}</p>
        </div>
    );
};
