import { For, createMemo, createSignal, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { TableOfContents } from "@thewaver/ss-components-solid";
import type { TableOfContentsLink } from "@thewaver/ss-components-solid";
import {
    HEADING_LEVEL,
    SECTIONS,
    TOC_GAP,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import { PageTableOfContentsContent } from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent";

const TOP_DEPTH = 0;

export const RightToLeftDocsExample = () => {
    const idPrefix = createUniqueId();

    const [getHeadingRefs, setHeadingRefs] = createSignal<(HTMLElement | undefined)[]>([]);

    const toHeadingId = (sectionId: string) => `${idPrefix}-${sectionId}`;

    const getLinks = createMemo((): TableOfContentsLink<string>[] =>
        SECTIONS.map((section, index) => ({
            value: section.id,
            target: getHeadingRefs()[index],
            href: `#${toHeadingId(section.id)}`,
            depth: section.depth,
        })),
    );

    const setHeadingRef = (index: number, element: HTMLElement) => {
        setHeadingRefs((prev) => {
            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    return (
        <div dir={"rtl"} class={styles.tocRoot}>
            <div class={styles.tocNav}>
                <TableOfContents
                    links={getLinks}
                    gap={TOC_GAP}
                    ariaLabel={"Outline in a right-to-left box"}
                    renderLink={(getLink, getFlags) => (
                        <PageTableOfContentsContent flags={getFlags} depth={() => getLink().depth ?? TOP_DEPTH}>
                            {SECTIONS.find((section) => section.id === getLink().value)?.title}
                        </PageTableOfContentsContent>
                    )}
                />
            </div>

            <article class={styles.tocArticle}>
                <For each={SECTIONS}>
                    {(section, getIndex) => (
                        <section class={styles.tocSection} aria-labelledby={toHeadingId(section.id)}>
                            <Dynamic
                                component={`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`}
                                ref={(element: HTMLElement) => setHeadingRef(getIndex(), element)}
                                id={toHeadingId(section.id)}
                                class={styles.tocHeading}
                            >
                                {section.title}
                            </Dynamic>

                            <p class={styles.tocText}>{section.text}</p>
                        </section>
                    )}
                </For>
            </article>
        </div>
    );
};
