import type { PropsWithChildren } from "react";
import { useCallback, useMemo, useState } from "react";

import { TableOfContents } from "@thewaver/ss-components-react";
import type { TableOfContentsLink } from "@thewaver/ss-components-react";
import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import {
    DOCS_INTRO_TITLE,
    MIN_TABLE_OF_CONTENTS_LINKS,
    TABLE_OF_CONTENTS_GAP,
    TABLE_OF_CONTENTS_LABEL,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import type {
    DocsSectionRegistration,
    DocsTableOfContentsEntry,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

import { PageTableOfContentsContent } from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent";
import { PageDocsProse } from "../DocsProse/DocsProse";
import { DocsViewContextProvider } from "./DocsView.context";
import type { PageDocsViewProps } from "./DocsViewReact.types";

const SECTION_DEPTH = 0;

export const PageDocsView = (props: PropsWithChildren<PageDocsViewProps>) => {
    const [intro, setIntro] = useState<HTMLElement | null>(null);
    const [sections, setSections] = useState<DocsSectionRegistration[]>([]);

    const register = useCallback((section: DocsSectionRegistration) => {
        setSections((current) => [...current, section]);

        return () => setSections((current) => current.filter((candidate) => candidate !== section));
    }, []);

    const registration = useMemo(() => ({ register }), [register]);

    const links = useMemo(
        (): TableOfContentsLink<DocsTableOfContentsEntry>[] =>
            [...(intro ? [{ title: DOCS_INTRO_TITLE, element: intro }] : []), ...sections].map(({ title, element }) => {
                const id = toDocsSectionId(title);

                return {
                    value: { id, title, depth: SECTION_DEPTH },
                    target: element,
                    href: `#${id}`,
                    depth: SECTION_DEPTH,
                };
            }),
        [intro, sections],
    );

    return (
        <div className={styles.docsLayout} data-view={"docs"}>
            <div className={styles.docsView}>
                <p ref={setIntro} id={toDocsSectionId(DOCS_INTRO_TITLE)} className={styles.docsLead}>
                    <PageDocsProse content={props.description} />
                </p>

                <DocsViewContextProvider value={registration}>{props.children}</DocsViewContextProvider>
            </div>

            {links.length >= MIN_TABLE_OF_CONTENTS_LINKS && (
                <aside className={styles.docsTableOfContents}>
                    <TableOfContents
                        links={links}
                        gap={TABLE_OF_CONTENTS_GAP}
                        ariaLabel={TABLE_OF_CONTENTS_LABEL}
                        renderLink={(link, flags) => (
                            <PageTableOfContentsContent flags={flags} depth={link.value.depth}>
                                {link.value.title}
                            </PageTableOfContentsContent>
                        )}
                    />
                </aside>
            )}
        </div>
    );
};
