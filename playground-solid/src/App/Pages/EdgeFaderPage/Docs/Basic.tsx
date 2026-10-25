import { EdgeFader } from "@thewaver/ss-components-solid";
import { COLUMN_ROWS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderBasicDocsExampleProps } from "../EdgeFaderPageSolid.types";

type Props = EdgeFaderBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <div class={styles.frame}>
        <EdgeFader edges={["top", "bottom"]} size={props.size} ariaLabel={"Rows"}>
            <div class={styles.column}>
                {COLUMN_ROWS.map((label) => (
                    <div class={styles.row}>{label}</div>
                ))}
            </div>
        </EdgeFader>
    </div>
);
