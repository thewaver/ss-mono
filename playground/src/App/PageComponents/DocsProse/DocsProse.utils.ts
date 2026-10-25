import { DOCS_PROSE_PROP_TAG, WCAG_URLS } from "./DocsProse.const";

import * as styles from "../DocsView/DocsView.css";

export const toWcagHref = (id: string | undefined) =>
    id !== undefined && Object.hasOwn(WCAG_URLS, id) ? WCAG_URLS[id as keyof typeof WCAG_URLS] : undefined;

export const toDocsProseClasses = (defaultClasses: Record<string, string>) => ({
    ...defaultClasses,
    [DOCS_PROSE_PROP_TAG]: styles.docsPropName,
});
