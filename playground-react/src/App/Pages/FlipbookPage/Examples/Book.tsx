import { Flipbook } from "@thewaver/ss-components-react";
import type { FlipbookControls } from "@thewaver/ss-components-react";
import {
    computeFlipbookPageLabel,
    computeFlipbookSpreadAnnouncement,
    computeFlipbookStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { FlipbookExampleProps } from "../FlipbookPage.types";

const BOOK_GAP = 10;
const FIRST_PAGE = 0;

type Props = FlipbookExampleProps;

const renderControls = (controls: FlipbookControls) => (
    <div className={styles.controls}>
        {controls.renderStep("previous")}
        {controls.renderStep("next")}
    </div>
);

export const BookExample = (props: Props) => (
    <div className={styles.stage}>
        <div className={styles.book}>
            <Flipbook
                pages={FLIPBOOK_PAGES}
                index={props.index}
                transitionDurationMs={props.transitionDurationMs}
                gap={BOOK_GAP}
                ariaLabel={"A book of hinges"}
                computePageLabel={computeFlipbookPageLabel}
                computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
                computeStepLabel={computeFlipbookStepLabel}
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
                renderStep={(step, renderProps) => (
                    <PageControlButtonContent flags={renderProps} glyph={CONTROL_GLYPHS[step]} />
                )}
                renderControls={renderControls}
            />
        </div>
    </div>
);
