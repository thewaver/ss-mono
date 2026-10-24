import type { ParentProps } from "solid-js";
import { Show, createMemo, createSignal } from "solid-js";

import { TableOfContents, access } from "@thewaver/ss-components-solid";
import type { TableOfContentsLink } from "@thewaver/ss-components-solid";
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
import { DocsViewContextProvider } from "./DocsView.context";
import type { PageDocsViewProps } from "./DocsViewSolid.types";

const SECTION_DEPTH = 0;

export const PageDocsView = (props: ParentProps<PageDocsViewProps>) => {
    const [getIntroRef, setIntroRef] = createSignal<HTMLElement>();
    const [getSections, setSections] = createSignal<DocsSectionRegistration[]>([]);

    const register = (section: DocsSectionRegistration) => {
        setSections((sections) => [...sections, section]);

        return () => setSections((sections) => sections.filter((candidate) => candidate !== section));
    };

    const getLinks = createMemo((): TableOfContentsLink<DocsTableOfContentsEntry>[] => {
        const intro = getIntroRef();

        return [...(intro ? [{ title: DOCS_INTRO_TITLE, element: intro }] : []), ...getSections()].map(
            ({ title, element }) => {
                const id = toDocsSectionId(title);

                return {
                    value: { id, title, depth: SECTION_DEPTH },
                    target: element,
                    href: `#${id}`,
                    depth: SECTION_DEPTH,
                };
            },
        );
    });

    return (
        <div class={styles.docsLayout} data-view={"docs"}>
            <div class={styles.docsView}>
                <p ref={setIntroRef} id={toDocsSectionId(DOCS_INTRO_TITLE)} class={styles.docsLead}>
                    {access(props.description)}
                </p>

                <DocsViewContextProvider value={{ register }}>{props.children}</DocsViewContextProvider>
            </div>

            <Show when={getLinks().length >= MIN_TABLE_OF_CONTENTS_LINKS}>
                <aside class={styles.docsTableOfContents}>
                    <TableOfContents
                        links={getLinks}
                        gap={TABLE_OF_CONTENTS_GAP}
                        ariaLabel={TABLE_OF_CONTENTS_LABEL}
                        renderLink={(getLink, getFlags) => (
                            <PageTableOfContentsContent flags={getFlags} depth={() => getLink().value.depth}>
                                {getLink().value.title}
                            </PageTableOfContentsContent>
                        )}
                    />
                </aside>
            </Show>
        </div>
    );
};
