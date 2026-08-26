import { RichText } from "@thewaver/ss-components";
import type { AccessorProps } from "@thewaver/ss-components";

import * as styles from "../RichTextPage.css";

type Props = AccessorProps<{
    content: string;
    removeOtherTags: boolean;
}>;

export const CustomExample = (props: Props) => (
    <div class={styles.previewText}>
        <RichText content={props.content} removeOtherTags={props.removeOtherTags} />
    </div>
);
