import { For, createEffect, createSignal } from "solid-js";

import { ElementObserverUtils } from "@thewaver/ss-components";

import { TOC_SECTIONS } from "../ScrollerPage.const";
import type { ScrollerTableOfContentsExampleProps } from "../ScrollerPage.types";

import * as styles from "../ScrollerPage.css";

type Props = ScrollerTableOfContentsExampleProps;

export const TableOfContentsExample = (props: Props) => {
    const [getHeadingRefs, setHeadingRefs] = createSignal<(HTMLElement | undefined)[]>([]);

    const getCurrent = ElementObserverUtils.createViewportCurrentIndexObserver(getHeadingRefs);

    createEffect(() => {
        props.onCurrentChange(getCurrent());
    });

    const setHeadingRef = (index: number, element: HTMLElement) => {
        setHeadingRefs((prev) => {
            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    const goTo = (index: number) => {
        const heading = getHeadingRefs()[index];

        if (!heading) return;

        heading.scrollIntoView({ block: "start" });
        heading.focus({ preventScroll: true });
    };

    return (
        <div class={styles.tocRoot}>
            <nav class={styles.tocNav} aria-label={"On this page"}>
                <ul class={styles.tocList}>
                    <For each={TOC_SECTIONS}>
                        {(section, getIndex) => (
                            <li>
                                <a
                                    id={`${section.id}Link`}
                                    class={styles.tocLink}
                                    href={`#${section.id}`}
                                    aria-current={getCurrent() === getIndex() ? "true" : undefined}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goTo(getIndex());
                                    }}
                                >
                                    {section.title}
                                </a>
                            </li>
                        )}
                    </For>
                </ul>
            </nav>

            <article class={styles.tocArticle}>
                <For each={TOC_SECTIONS}>
                    {(section, getIndex) => (
                        <section class={styles.tocSection} aria-labelledby={section.id}>
                            <h3
                                ref={(element) => setHeadingRef(getIndex(), element)}
                                id={section.id}
                                class={styles.tocHeading}
                                tabindex={-1}
                            >
                                {section.title}
                            </h3>

                            <p>{section.text}</p>
                        </section>
                    )}
                </For>
            </article>
        </div>
    );
};
