import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import { useDocsViewContext } from "../DocsView/DocsView.context";
import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsSectionProps } from "./DocsSectionReact.types";

export const PageDocsSection = (props: PropsWithChildren<PageDocsSectionProps>) => {
    const isPreview = useIsPreview();
    const docsView = useDocsViewContext();
    const [heading, setHeading] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!docsView || !heading) return;

        return docsView.register({ title: props.title, element: heading });
    }, [docsView, heading, props.title]);

    if (isPreview) return null;

    return (
        <section className={styles.docsGroup} data-docs-section>
            <h2 ref={setHeading} id={toDocsSectionId(props.title)} className={styles.docsGroupTitle}>
                {props.title}
            </h2>

            <p className={styles.docsLead}>{props.children}</p>
        </section>
    );
};
