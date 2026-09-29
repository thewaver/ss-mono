import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/CodeBox/CodeBox.css";

import type { PageCodeBoxProps } from "./CodeBox.types";

export const PageCodeBox = (props: PageCodeBoxProps) => {
    return (
        <div class={styles.codeBoxRoot}>
            <div class={styles.codeBoxContent} innerHTML={access(props.source)} />
        </div>
    );
};
