import { EdgeFader } from "@thewaver/ss-components-react";
import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderBasicDocsExampleProps } from "../EdgeFaderPageReact.types";

type Props = EdgeFaderBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <div className={styles.frame}>
        <EdgeFader edges={["top", "bottom"]} size={props.size} ariaLabel={"Rows"}>
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
