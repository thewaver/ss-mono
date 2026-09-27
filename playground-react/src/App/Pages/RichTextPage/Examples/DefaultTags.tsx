import { Fragment } from "react";

import { RichText } from "@thewaver/ss-components-react";
import { TAG_DEFS } from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.css";

export const DefaultTagsExample = () => (
    <div className={styles.legendRoot}>
        <div className={styles.legendTitle}>Default tags</div>

        <div className={styles.legendGrid}>
            {TAG_DEFS.map((tag) => (
                <Fragment key={tag.tag}>
                    <span>
                        <span className={styles.legendTag}>{`[${tag.tag}]`}</span>
                        <span>{tag.name}</span>
                        <span className={styles.legendTag}>{`[/${tag.tag}]`}</span>
                    </span>
                    <span>
                        <RichText content={`[${tag.tag}]${tag.name}[/${tag.tag}]`} />
                    </span>
                </Fragment>
            ))}
        </div>
    </div>
);
