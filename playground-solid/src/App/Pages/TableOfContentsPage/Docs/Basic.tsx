import { For, createMemo, createSignal, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { TableOfContents } from "@thewaver/ss-components-solid";
import type { TableOfContentsLink } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    HEADING_LEVEL,
    SECTIONS,
    TOC_GAP,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import { PageTableOfContentsContent } from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent";
import type { TableOfContentsBasicDocsExampleProps } from "../TableOfContentsPageSolid.types";

const TOP_DEPTH = 0;

type Props = TableOfContentsBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const idPrefix = createUniqueId();

    const [getHeadingRefs, setHeadingRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getCurrent, setCurrent] = createSignal<string>();

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
        <>
            <div class={styles.tocRoot}>
                <div class={styles.tocNav}>
                    <TableOfContents
                        links={getLinks}
                        gap={TOC_GAP}
                        offsetRatio={props.offsetRatio}
                        ariaLabel={"Outline"}
                        renderLink={(getLink, getFlags) => (
                            <PageTableOfContentsContent flags={getFlags} depth={() => getLink().depth ?? TOP_DEPTH}>
                                {SECTIONS.find((section) => section.id === getLink().value)?.title}
                            </PageTableOfContentsContent>
                        )}
                        onCurrentChange={setCurrent}
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

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Current: ${SECTIONS.find((section) => section.id === getCurrent())?.title ?? "none"}`}
            </div>
        </>
    );
};
