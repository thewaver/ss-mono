import { For, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";

import { TableOfContents, access } from "@thewaver/ss-components";
import type { TableOfContentsLink } from "@thewaver/ss-components";

import { PageTableOfContentsContent } from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent";
import { HEADING_LEVEL, TOC_GAP } from "../TableOfContentsPage.const";
import type { TableOfContentsExampleProps } from "../TableOfContentsPage.types";

import * as styles from "../TableOfContentsPage.css";

const TOP_DEPTH = 0;

type Props = TableOfContentsExampleProps;

export const TableOfContentsExample = (props: Props) => {
    const [getHeadingRefs, setHeadingRefs] = createSignal<(HTMLElement | undefined)[]>([]);

    const getLinks = createMemo((): TableOfContentsLink<string>[] =>
        access(props.sections).map((section, index) => ({
            value: section.id,
            target: getHeadingRefs()[index],
            href: `#${section.id}`,
            depth: section.depth,
            id: `${section.id}Link`,
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
        <div class={styles.tocRoot}>
            <div class={styles.tocNav}>
                <TableOfContents
                    links={getLinks}
                    gap={TOC_GAP}
                    ariaLabel={access(props.ariaLabel)}
                    renderLink={(getLink, getFlags) => (
                        <PageTableOfContentsContent flags={getFlags} depth={() => getLink().depth ?? TOP_DEPTH}>
                            {access(props.sections).find((section) => section.id === getLink().value)?.title}
                        </PageTableOfContentsContent>
                    )}
                    onCurrentChange={props.onCurrentChange}
                />
            </div>

            <article class={styles.tocArticle}>
                <For each={access(props.sections)}>
                    {(section, getIndex) => (
                        <section class={styles.tocSection} aria-labelledby={section.id}>
                            <Dynamic
                                component={`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`}
                                ref={(element: HTMLElement) => setHeadingRef(getIndex(), element)}
                                id={section.id}
                                class={styles.tocHeading}
                            >
                                {section.title}
                            </Dynamic>

                            <p>{section.text}</p>
                        </section>
                    )}
                </For>
            </article>
        </div>
    );
};
