import { RichText } from "@thewaver/ss-components";

import { DIFF_CONTENT } from "../RichTextPage.const";

import * as styles from "../RichTextPage.css";

const computeDiffClassNames = (defaultClasses: Record<string, string>) => ({
    ...defaultClasses,
    add: styles.addedText,
    sub: styles.removedText,
});

export const CustomTagsExample = () => (
    <div class={styles.diffText}>
        <RichText content={DIFF_CONTENT} computeClassNames={computeDiffClassNames} />
    </div>
);
