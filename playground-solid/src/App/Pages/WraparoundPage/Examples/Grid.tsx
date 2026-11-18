import { For } from "solid-js";

import { Wraparound } from "@thewaver/ss-components-solid";
import {
    GRID_CELLS,
    NUMBERED_BUTTONS_REPEATING_EVERY_LABEL,
} from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPageSolid.types";

type Props = WraparoundExampleProps;

export const GridExample = (props: Props) => (
    <div class={styles.smallStage}>
        <Wraparound
            ariaLabel={NUMBERED_BUTTONS_REPEATING_EVERY_LABEL}
            renderContent={() => (
                <div class={styles.gridTile}>
                    <For each={GRID_CELLS}>
                        {(cell) => (
                            <button type="button" class={styles.gridCell} onClick={() => props.onPress(cell)}>
                                {cell}
                            </button>
                        )}
                    </For>
                </div>
            )}
        />
    </div>
);
