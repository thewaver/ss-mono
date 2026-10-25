import { onCleanup } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import { PageDocsProse } from "../DocsProse/DocsProse";
import { useDocsViewContext } from "../DocsView/DocsView.context";
import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsSectionProps } from "./DocsSectionSolid.types";

export const PageDocsSection = (props: PageDocsSectionProps) => {
    if (useIsPreview()) return null;

    const docsView = useDocsViewContext();

    return (
        <section class={styles.docsGroup} data-docs-section>
            <h2
                ref={(element) => {
                    const unregister = docsView?.register({ title: access(props.title), element });

                    if (unregister) onCleanup(unregister);
                }}
                id={toDocsSectionId(access(props.title))}
                class={styles.docsGroupTitle}
            >
                {access(props.title)}
            </h2>

            <p class={styles.docsLead}>
                <PageDocsProse content={props.content} />
            </p>
        </section>
    );
};
