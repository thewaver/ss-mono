import { EdgeFader } from "@thewaver/ss-components-solid";
import { STRIP_CHIPS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderScrollAwareDocsExampleProps } from "../EdgeFaderPageSolid.types";

type Props = EdgeFaderScrollAwareDocsExampleProps;

export const ScrollAwareDocsExample = (props: Props) => (
    <div class={styles.autoHeightFrame}>
        <EdgeFader edges={["left", "right"]} isScrollAware={props.isScrollAware} ariaLabel={"Items"}>
            <div class={styles.strip}>
                {STRIP_CHIPS.map((label) => (
                    <div class={styles.chip}>{label}</div>
                ))}
            </div>
        </EdgeFader>
    </div>
);
