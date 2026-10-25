import { EdgeFader } from "@thewaver/ss-components-react";
import { STRIP_CHIPS } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderScrollAwareDocsExampleProps } from "../EdgeFaderPageReact.types";

type Props = EdgeFaderScrollAwareDocsExampleProps;

export const ScrollAwareDocsExample = (props: Props) => (
    <div className={styles.autoHeightFrame}>
        <EdgeFader edges={["left", "right"]} isScrollAware={props.isScrollAware} ariaLabel={"Items"}>
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
