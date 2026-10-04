import { Wraparound } from "@thewaver/ss-components-react";
import { GRID_CELLS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPage.types";

type Props = WraparoundExampleProps;

export const GridExample = (props: Props) => (
    <div className={styles.smallStage}>
        <Wraparound
            ariaLabel={"Numbered buttons, repeating in every direction"}
            renderContent={() => (
                <div className={styles.gridTile}>
                    {GRID_CELLS.map((cell) => (
                        <button
                            key={cell}
                            type="button"
                            className={styles.gridCell}
                            onClick={() => props.onPress(cell)}
                        >
                            {cell}
                        </button>
                    ))}
                </div>
            )}
        />
    </div>
);
