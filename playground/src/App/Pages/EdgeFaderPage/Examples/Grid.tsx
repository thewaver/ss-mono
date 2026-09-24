import { EdgeFader } from "@thewaver/ss-components";

import { GRID_TILES } from "../EdgeFaderPage.const";
import type { EdgeFaderExampleProps } from "../EdgeFaderPage.types";

import * as styles from "../EdgeFaderPage.css";

export const GridExample = (props: EdgeFaderExampleProps) => {
    return (
        <div class={styles.frame}>
            <EdgeFader ariaLabel={"Tiles"} size={props.size} isScrollAware={props.isScrollAware}>
                <div class={styles.grid}>
                    {GRID_TILES.map((label) => (
                        <div class={styles.tile}>{label}</div>
                    ))}
                </div>
            </EdgeFader>
        </div>
    );
};
