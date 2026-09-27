import { Index } from "solid-js";

import { RichText } from "@thewaver/ss-components-solid";
import { TAG_DEFS } from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.css";

export const DefaultTagsExample = () => (
    <div class={styles.legendRoot}>
        <div class={styles.legendTitle}>Default tags</div>

        <div class={styles.legendGrid}>
            <Index each={TAG_DEFS}>
                {(getTag) => (
                    <>
                        <span>
                            <span class={styles.legendTag}>{`[${getTag().tag}]`}</span>
                            <span>{getTag().name}</span>
                            <span class={styles.legendTag}>{`[/${getTag().tag}]`}</span>
                        </span>
                        <span>
                            <RichText content={`[${getTag().tag}]${getTag().name}[/${getTag().tag}]`} />
                        </span>
                    </>
                )}
            </Index>
        </div>
    </div>
);
