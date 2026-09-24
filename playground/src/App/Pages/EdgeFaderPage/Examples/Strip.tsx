import { EdgeFader } from "@thewaver/ss-components";

import { STRIP_CHIPS } from "../EdgeFaderPage.const";
import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

import * as styles from "../EdgeFaderPage.css";

export const StripExample = (props: EdgeFaderExampleProps) => {
    return (
        <div class={styles.autoHeightFrame}>
            <EdgeFader
                edges={["left", "right"]}
                ariaLabel={"Items"}
                size={props.size}
                isScrollAware={props.isScrollAware}
            >
                <div class={styles.strip}>
                    {STRIP_CHIPS.map((label) => (
                        <div class={styles.chip}>{label}</div>
                    ))}
                </div>
            </EdgeFader>
        </div>
    );
};
