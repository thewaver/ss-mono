import { useMemo, useState } from "react";

import { TableOfContents } from "@thewaver/ss-components-react";
import type { TableOfContentsLink } from "@thewaver/ss-components-react";
import {
    HEADING_LEVEL,
    TOC_GAP,
} from "@thewaver/ss-playground-core/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import { PageTableOfContentsContent } from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent";
import type { TableOfContentsExampleProps } from "../TableOfContentsPage.types";

const TOP_DEPTH = 0;

type Props = TableOfContentsExampleProps;

export const TableOfContentsExample = (props: Props) => {
    const [headingRefs, setHeadingRefs] = useState<(HTMLElement | undefined)[]>([]);

    const links = useMemo(
        (): TableOfContentsLink<string>[] =>
            props.sections.map((section, index) => ({
                value: section.id,
                target: headingRefs[index],
                href: `#${section.id}`,
                depth: section.depth,
                id: `${section.id}Link`,
            })),
        [props.sections, headingRefs],
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
        <div className={styles.tocRoot}>
            <div className={styles.tocNav}>
                <TableOfContents
                    links={links}
                    gap={TOC_GAP}
                    ariaLabel={props.ariaLabel}
                    renderLink={(link, flags) => (
                        <PageTableOfContentsContent flags={flags} depth={link.depth ?? TOP_DEPTH}>
                            {props.sections.find((section) => section.id === link.value)?.title}
                        </PageTableOfContentsContent>
                    )}
                    onCurrentChange={props.onCurrentChange}
                />
            </div>

            <article className={styles.tocArticle}>
                {props.sections.map((section, index) => {
                    const Heading = `h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}` as "h3" | "h4" | "h5" | "h6";

                    return (
                        <section key={section.id} className={styles.tocSection} aria-labelledby={section.id}>
                            <Heading
                                ref={(element: HTMLElement | null) => setHeadingRef(index, element)}
                                id={section.id}
                                className={styles.tocHeading}
                            >
                                {section.title}
                            </Heading>

                            <p>{section.text}</p>
                        </section>
                    );
                })}
            </article>
        </div>
    );
};
