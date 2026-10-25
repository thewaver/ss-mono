import { createSignal } from "solid-js";

import { Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerBothWaysDocsExampleProps } from "../ScrollerPageSolid.types";

const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerBothWaysDocsExampleProps;

export const BothWaysDocsExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.bothWaysLayout}>
            <div class={styles.bothWaysCell.up}>
                <PageScrollerButton id={"bothWaysUp"} controller={getController} step={"previous"} axis={"y"} />
            </div>

            <div class={styles.bothWaysCell.back}>
                <PageScrollerButton id={"bothWaysBack"} controller={getController} step={"previous"} axis={"x"} />
            </div>

            <div class={styles.bothWaysCell.box}>
                <Scroller
                    padding={FOCUS_RING_WIDTH}
                    overflowX={props.overflowX}
                    overflowY={props.overflowY}
                    renderBar={(getRenderProps, refs) => (
                        <PageScrollerBarContent renderProps={getRenderProps} refs={refs} />
                    )}
                    onMount={setController}
                >
                    <div class={styles.cellGrid}>
                        {INDICES.flatMap((row) =>
                            INDICES.map((column) => <div class={styles.chip}>{getGridCellLabel(row, column)}</div>),
                        )}
                    </div>
                </Scroller>
            </div>

            <div class={styles.bothWaysCell.next}>
                <PageScrollerButton id={"bothWaysForward"} controller={getController} step={"next"} axis={"x"} />
            </div>

            <div class={styles.bothWaysCell.down}>
                <PageScrollerButton id={"bothWaysDown"} controller={getController} step={"next"} axis={"y"} />
            </div>
        </div>
    );
};
