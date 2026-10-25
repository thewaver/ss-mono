import { useId, useMemo, useState } from "react";

import { TableOfContents } from "@thewaver/ss-components-react";
import type { TableOfContentsLink } from "@thewaver/ss-components-react";
import {
    HEADING_LEVEL,
    SECTIONS,
    TOC_GAP,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import { PageTableOfContentsContent } from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent";

const TOP_DEPTH = 0;

export const RightToLeftDocsExample = () => {
    const idPrefix = useId();

    const [headingRefs, setHeadingRefs] = useState<(HTMLElement | undefined)[]>([]);

    const toHeadingId = (sectionId: string) => `${idPrefix}-${sectionId}`;

    const links = useMemo(
        (): TableOfContentsLink<string>[] =>
            SECTIONS.map((section, index) => ({
                value: section.id,
                target: headingRefs[index],
                href: `#${toHeadingId(section.id)}`,
                depth: section.depth,
            })),
        [headingRefs],
    );

    const setHeadingRef = (index: number, element: HTMLElement | null) => {
        if (!element) return;

        setHeadingRefs((prev) => {
            if (prev[index] === element) return prev;

            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    return (
        <div dir={"rtl"} className={styles.tocRoot}>
            <div className={styles.tocNav}>
                <TableOfContents
                    links={links}
                    gap={TOC_GAP}
                    ariaLabel={"Outline in a right-to-left box"}
                    renderLink={(link, flags) => (
                        <PageTableOfContentsContent flags={flags} depth={link.depth ?? TOP_DEPTH}>
                            {SECTIONS.find((section) => section.id === link.value)?.title}
                        </PageTableOfContentsContent>
                    )}
                />
            </div>

            <article className={styles.tocArticle}>
                {SECTIONS.map((section, index) => {
                    const Heading = `h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}` as "h3" | "h4" | "h5" | "h6";

                    return (
                        <section
                            key={section.id}
                            className={styles.tocSection}
                            aria-labelledby={toHeadingId(section.id)}
                        >
                            <Heading
                                ref={(element: HTMLElement | null) => setHeadingRef(index, element)}
                                id={toHeadingId(section.id)}
                                className={styles.tocHeading}
                            >
                                {section.title}
                            </Heading>

                            <p className={styles.tocText}>{section.text}</p>
                        </section>
                    );
                })}
            </article>
        </div>
    );
};
