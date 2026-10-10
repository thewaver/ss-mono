import { For, Match, Switch } from "solid-js";

import * as styles from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.css";
import type { AboutInline } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.types";
import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

import { PageCodeBox } from "../CodeBox/CodeBox";
import { PageLayer } from "../Layer/Layer";
import type { PageArticleProps } from "./Article.types";

const renderInline = (inline: AboutInline) =>
    typeof inline === "string" ? inline : <a href={inline.href}>{inline.text}</a>;

export const PageArticle = (props: PageArticleProps) => {
    return (
        <div class={styles.aboutPage} data-view={props.view}>
            <h1 class={styles.aboutTitle}>{props.title}</h1>

            <For each={props.sections}>
                {(section) => (
                    <section class={styles.aboutSection}>
                        <h2 class={styles.aboutHeading}>{section.heading}</h2>

                        <For each={section.blocks}>
                            {(block) => (
                                <Switch>
                                    <Match when={block.kind === "paragraph" && block}>
                                        {(getBlock) => (
                                            <p class={styles.aboutParagraph}>
                                                <For each={getBlock().text}>{renderInline}</For>
                                            </p>
                                        )}
                                    </Match>
                                    <Match when={block.kind === "list" && block}>
                                        {(getBlock) => (
                                            <ul class={styles.aboutList}>
                                                <For each={getBlock().items}>
                                                    {(item) => (
                                                        <li>
                                                            <For each={item}>{renderInline}</For>
                                                        </li>
                                                    )}
                                                </For>
                                            </ul>
                                        )}
                                    </Match>
                                    <Match when={block.kind === "code" && block}>
                                        {(getBlock) => (
                                            <PageLayer level={1}>
                                                <PageCodeBox
                                                    source={AboutPageUtils.toCodeHtml(
                                                        getBlock().language,
                                                        getBlock().source,
                                                    )}
                                                />
                                            </PageLayer>
                                        )}
                                    </Match>
                                </Switch>
                            )}
                        </For>
                    </section>
                )}
            </For>
        </div>
    );
};
