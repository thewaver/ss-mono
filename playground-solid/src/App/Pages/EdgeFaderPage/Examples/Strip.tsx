import { EdgeFader } from "@thewaver/ss-components-solid";
import { STRIP_CHIPS } from "@thewaver/ss-playground-core/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

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
