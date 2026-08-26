import { Index } from "solid-js";

import { RichText } from "@thewaver/ss-components";

import { TAG_DEFS } from "../RichTextPage.const";

import * as styles from "../RichTextPage.css";

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
