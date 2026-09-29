import { EdgeFader } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

export const CardExample = (props: EdgeFaderExampleProps) => {
    return (
        <div className={styles.autoHeightFrame}>
            <EdgeFader size={props.size} isScrollAware={props.isScrollAware}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Nothing to scroll</h3>
                    <p className={styles.cardText}>
                        This card fits its box, so it only fades while the fade is fixed. Turn on scroll-aware and the
                        edges come back sharp, because there is nothing further to reach in any direction.
                    </p>
                </div>
            </EdgeFader>
        </div>
    );
};
