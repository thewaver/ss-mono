import { EdgeFader } from "@thewaver/ss-components-react";
import { COLUMN_ROWS } from "@thewaver/ss-playground-core/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

export const ColumnExample = (props: EdgeFaderExampleProps) => {
    return (
        <div className={styles.frame}>
            <EdgeFader
                edges={["top", "bottom"]}
                ariaLabel={"Rows"}
                size={props.size}
                isScrollAware={props.isScrollAware}
            >
                <div className={styles.column}>
                    {COLUMN_ROWS.map((label) => (
                        <div key={label} className={styles.row}>
                            {label}
                        </div>
                    ))}
                </div>
            </EdgeFader>
        </div>
    );
};
