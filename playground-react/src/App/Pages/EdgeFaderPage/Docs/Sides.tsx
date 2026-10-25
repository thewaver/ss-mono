import { EdgeFader } from "@thewaver/ss-components-react";
import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderSidesDocsExampleProps } from "../EdgeFaderPageReact.types";

type Props = EdgeFaderSidesDocsExampleProps;

export const SidesDocsExample = (props: Props) => (
    <div className={styles.frame}>
        <EdgeFader edges={props.edges} ariaLabel={"Tiles"}>
            <div className={styles.grid}>
                {GRID_TILES.map((label) => (
                    <div key={label} className={styles.tile}>
                        {label}
                    </div>
                ))}
            </div>
        </EdgeFader>
    </div>
);
