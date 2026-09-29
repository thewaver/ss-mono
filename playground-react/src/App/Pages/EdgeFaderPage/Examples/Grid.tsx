import { EdgeFader } from "@thewaver/ss-components-react";
import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

export const GridExample = (props: EdgeFaderExampleProps) => {
    return (
        <div className={styles.frame}>
            <EdgeFader ariaLabel={"Tiles"} size={props.size} isScrollAware={props.isScrollAware}>
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
};
