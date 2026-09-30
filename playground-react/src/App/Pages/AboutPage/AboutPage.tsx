import * as styles from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.css";
import type { AboutInline } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.types";
import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

import { PageCodeBox } from "../../PageComponents/CodeBox/CodeBox";
import { OWN_FRAMEWORK } from "../../PageComponents/FrameworkMenu/FrameworkMenu.const";
import { PageLayer } from "../../PageComponents/Layer/Layer";

const SECTIONS = AboutPageUtils.computeSections(OWN_FRAMEWORK);

const renderInline = (inline: AboutInline, index: number) =>
    typeof inline === "string" ? (
        inline
    ) : (
        <a key={index} href={inline.href}>
            {inline.text}
        </a>
    );

export const AboutPage = () => {
    return (
        <div className={styles.aboutPage} data-view={"about"}>
            <h1 className={styles.aboutTitle}>{"About"}</h1>

            {SECTIONS.map((section) => (
                <section key={section.heading} className={styles.aboutSection}>
                    <h2 className={styles.aboutHeading}>{section.heading}</h2>

                    {section.blocks.map((block, index) => {
                        switch (block.kind) {
                            case "paragraph":
                                return (
                                    <p key={index} className={styles.aboutParagraph}>
                                        {block.text.map(renderInline)}
                                    </p>
                                );
                            case "list":
                                return (
                                    <ul key={index} className={styles.aboutList}>
                                        {block.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>{item.map(renderInline)}</li>
                                        ))}
                                    </ul>
                                );
                            case "code":
                                return (
                                    <PageLayer key={index} level={1}>
                                        <PageCodeBox source={AboutPageUtils.toCodeHtml(block.language, block.source)} />
                                    </PageLayer>
                                );
                        }
                    })}
                </section>
            ))}
        </div>
    );
};
