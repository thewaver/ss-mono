import { EdgeFader } from "@thewaver/ss-components-solid";
import { GRID_TILES } from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";

import type { EdgeFaderSidesDocsExampleProps } from "../EdgeFaderPageSolid.types";

type Props = EdgeFaderSidesDocsExampleProps;

export const SidesDocsExample = (props: Props) => (
    <div class={styles.frame}>
        <EdgeFader edges={props.edges} ariaLabel={"Tiles"}>
            <div class={styles.grid}>
                {GRID_TILES.map((label) => (
                    <div class={styles.tile}>{label}</div>
                ))}
            </div>
        </EdgeFader>
    </div>
);
