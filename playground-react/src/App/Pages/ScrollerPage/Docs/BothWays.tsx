import { useState } from "react";

import { Scroller } from "@thewaver/ss-components-react";
import type { ScrollerController } from "@thewaver/ss-components-react";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerBothWaysDocsExampleProps } from "../ScrollerPageReact.types";

const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerBothWaysDocsExampleProps;

export const BothWaysDocsExample = (props: Props) => {
    const [controller, setController] = useState<ScrollerController>();

    return (
        <div className={styles.bothWaysLayout}>
            <div className={styles.bothWaysCell.up}>
                <PageScrollerButton id={"bothWaysUp"} controller={controller} step={"previous"} axis={"y"} />
            </div>

            <div className={styles.bothWaysCell.back}>
                <PageScrollerButton id={"bothWaysBack"} controller={controller} step={"previous"} axis={"x"} />
            </div>

            <div className={styles.bothWaysCell.box}>
                <Scroller
                    padding={FOCUS_RING_WIDTH}
                    overflowX={props.overflowX}
                    overflowY={props.overflowY}
                    renderBar={(renderProps, refs) => <PageScrollerBarContent renderProps={renderProps} refs={refs} />}
                    onMount={setController}
                >
                    <div className={styles.cellGrid}>
                        {INDICES.flatMap((row) =>
                            INDICES.map((column) => (
                                <div key={`${row}-${column}`} className={styles.chip}>
                                    {getGridCellLabel(row, column)}
                                </div>
                            )),
                        )}
                    </div>
                </Scroller>
            </div>

            <div className={styles.bothWaysCell.next}>
                <PageScrollerButton id={"bothWaysForward"} controller={controller} step={"next"} axis={"x"} />
            </div>

            <div className={styles.bothWaysCell.down}>
                <PageScrollerButton id={"bothWaysDown"} controller={controller} step={"next"} axis={"y"} />
            </div>
        </div>
    );
};
