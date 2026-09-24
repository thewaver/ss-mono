import { EdgeFader } from "@thewaver/ss-components";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

import * as styles from "../EdgeFaderPage.css";

export const CardExample = (props: EdgeFaderExampleProps) => {
    return (
        <div class={styles.autoHeightFrame}>
            <EdgeFader size={props.size} isScrollAware={props.isScrollAware}>
                <div class={styles.card}>
                    <h3 class={styles.cardTitle}>Nothing to scroll</h3>
                    <p class={styles.cardText}>
                        This card fits its box, so it only fades while the fade is fixed. Turn on scroll-aware and the
                        edges come back sharp, because there is nothing further to reach in any direction.
                    </p>
                </div>
            </EdgeFader>
        </div>
    );
};
