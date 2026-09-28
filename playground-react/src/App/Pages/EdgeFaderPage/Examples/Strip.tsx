import { EdgeFader } from "@thewaver/ss-components-react";
import { STRIP_CHIPS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

export const StripExample = (props: EdgeFaderExampleProps) => {
    return (
        <div className={styles.autoHeightFrame}>
            <EdgeFader
                edges={["left", "right"]}
                ariaLabel={"Items"}
                size={props.size}
                isScrollAware={props.isScrollAware}
            >
                <div className={styles.strip}>
                    {STRIP_CHIPS.map((label) => (
                        <div key={label} className={styles.chip}>
                            {label}
                        </div>
                    ))}
                </div>
            </EdgeFader>
        </div>
    );
};
