import * as styles from "@thewaver/ss-playground/App/PageComponents/CodeBox/CodeBox.css";

import type { PageCodeBoxProps } from "./CodeBox.types";

export const PageCodeBox = (props: PageCodeBoxProps) => {
    return (
        <div className={styles.codeBoxRoot}>
            <div className={styles.codeBoxContent} dangerouslySetInnerHTML={{ __html: props.source }} />
        </div>
    );
};
