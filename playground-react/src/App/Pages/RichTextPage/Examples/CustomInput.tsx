import { RichText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

type Props = {
    content: string;
    removeOtherTags: boolean;
    maxDepth: number;
};

export const CustomInputExample = (props: Props) => (
    <div id={"customInputPreview"} className={styles.previewText}>
        <RichText content={props.content} removeOtherTags={props.removeOtherTags} maxDepth={props.maxDepth} />
    </div>
);
