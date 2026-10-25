import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { ALERT_SEVERITY_ICON } from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsAlertProps } from "./DocsAlertSolid.types";

export const PageDocsAlert = (props: ParentProps<PageDocsAlertProps>) => {
    if (useIsPreview()) return null;

    return (
        <div
            class={styles.docsAlertRoot}
            style={assignInlineVars({
                [styles.backgroundColor]: themeVars.color[access(props.severity)].contrast,
                [styles.color]: themeVars.color[access(props.severity)].main,
            })}
            role={"note"}
            data-docs-alert
        >
            <div class={styles.docsAlertContent}>
                <div class={styles.docsAlertLogo}>{ALERT_SEVERITY_ICON[access(props.severity)]}</div>
                <div>{props.children}</div>
            </div>
        </div>
    );
};
