import { EdgeFader } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

export const UnscrolledDocsExample = () => (
    <div className={styles.docsCardFrame}>
        <EdgeFader>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Nothing to scroll</h3>
                <p className={styles.cardText}>Everything in this card fits inside it.</p>
            </div>
        </EdgeFader>
    </div>
);
