import { EdgeFader } from "@thewaver/ss-components";

import { COLUMN_ROWS } from "../EdgeFaderPage.const";
import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

import * as styles from "../EdgeFaderPage.css";

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
