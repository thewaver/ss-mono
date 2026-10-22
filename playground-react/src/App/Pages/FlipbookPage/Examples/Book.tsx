import { useState, useSyncExternalStore } from "react";

import { Button, Flipbook } from "@thewaver/ss-components-react";
import type { FlipbookControls, FlipbookStep } from "@thewaver/ss-components-react";
import {
    computeFlipbookPageLabel,
    computeFlipbookSpreadAnnouncement,
    computeFlipbookStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { FlipbookExampleProps } from "../FlipbookPage.types";

const FIRST_PAGE = 0;

const STEPS: FlipbookStep[] = ["previous", "next"];

type Props = FlipbookExampleProps;

const BookControls = (props: { controls: FlipbookControls }) => {
    const { controls } = props;

    const canTurnPrevious = useSyncExternalStore(controls.subscribe, () => controls.getCanTurn("previous"));
    const canTurnNext = useSyncExternalStore(controls.subscribe, () => controls.getCanTurn("next"));
    const canTurn: Record<FlipbookStep, boolean> = { previous: canTurnPrevious, next: canTurnNext };

    return (
        <div className={styles.controls}>
            {STEPS.map((step) => (
                <Button
                    key={step}
                    ariaLabel={computeFlipbookStepLabel(step)}
                    isDisabled={!canTurn[step]}
                    renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS[step]} />}
                    onClick={() => {
                        controls.turn(step);
                    }}
                />
            ))}
        </div>
    );
};

export const BookExample = (props: Props) => {
    const [controls, setControls] = useState<FlipbookControls>();

    return (
        <div className={styles.stage}>
            <div className={styles.book}>
                <PageMeasureBox isFilling height={styles.BOOK_HEIGHT}>
                    <Flipbook
                        pages={FLIPBOOK_PAGES}
                        index={props.index}
                        transitionDurationMs={props.transitionDurationMs}
                        ariaLabel={"A book of hinges"}
                        computePageLabel={computeFlipbookPageLabel}
                        computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
                        renderPage={(page, state) => (
                            <div
                                className={[
                                    styles.page,
                                    state.side === "left" ? styles.pageLeft : styles.pageRight,
                                    (state.index === FIRST_PAGE || state.index === state.count - 1) && styles.cover,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <div className={styles.pageHeading}>{page.heading}</div>
                                <div className={styles.pageText}>{page.text}</div>
                                <div className={styles.pageNumber}>{state.index + 1}</div>
                            </div>
                        )}
                        onMount={setControls}
                    />
                </PageMeasureBox>
            </div>

            {controls && <BookControls controls={controls} />}
        </div>
    );
};
