import { RichText } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

type Props = AccessorProps<{
    content: string;
    removeOtherTags: boolean;
}>;

export const CustomInputExample = (props: Props) => (
    <div id={"customInputPreview"} class={styles.previewText}>
        <RichText content={props.content} removeOtherTags={props.removeOtherTags} />
    </div>
);
