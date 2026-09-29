import { EdgeFader } from "@thewaver/ss-components-solid";
import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

export const ColumnExample = (props: EdgeFaderExampleProps) => {
    return (
        <div class={styles.frame}>
            <EdgeFader
                edges={["top", "bottom"]}
                ariaLabel={"Rows"}
                size={props.size}
                isScrollAware={props.isScrollAware}
            >
                <div class={styles.column}>
                    {COLUMN_ROWS.map((label) => (
                        <div class={styles.row}>{label}</div>
                    ))}
                </div>
            </EdgeFader>
        </div>
    );
};
