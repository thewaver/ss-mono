import type { PropsWithChildren } from "react";

import { ALERT_SEVERITY_ICON } from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsAlert/DocsAlert.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsAlertProps } from "./DocsAlertReact.types";

export const PageDocsAlert = (props: PropsWithChildren<PageDocsAlertProps>) => {
    if (useIsPreview()) return null;

    return (
        <div
            className={styles.docsAlertRoot}
            style={assignInlineVars({
                [styles.backgroundColor]: themeVars.color[props.severity].contrast,
                [styles.color]: themeVars.color[props.severity].main,
            })}
            role={"note"}
            data-docs-alert
        >
            <div className={styles.docsAlertContent}>
                <div className={styles.docsAlertLogo}>{ALERT_SEVERITY_ICON[props.severity]}</div>
                <div>{props.children}</div>
            </div>
        </div>
    );
};
