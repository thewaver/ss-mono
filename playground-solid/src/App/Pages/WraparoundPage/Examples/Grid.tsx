import { For } from "solid-js";

import { Wraparound } from "@thewaver/ss-components-solid";
import { GRID_CELLS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPage.types";

type Props = WraparoundExampleProps;

export const GridExample = (props: Props) => (
    <div class={styles.smallStage}>
        <Wraparound
            ariaLabel={"Numbered buttons, repeating in every direction"}
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
