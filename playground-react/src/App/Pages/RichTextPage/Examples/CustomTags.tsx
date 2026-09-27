import { RichText } from "@thewaver/ss-components-react";
import { DIFF_CONTENT } from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/RichTextPage/RichTextPage.css";

const computeDiffClassNames = (defaultClasses: Record<string, string>) => ({
    ...defaultClasses,
    add: styles.addedText,
    sub: styles.removedText,
});

export const CustomTagsExample = () => (
    <div className={styles.diffText}>
        <RichText content={DIFF_CONTENT} computeClassNames={computeDiffClassNames} />
    </div>
);
