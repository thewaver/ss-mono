import { Flipbook } from "@thewaver/ss-components-solid";
import type { FlipbookControls } from "@thewaver/ss-components-solid";
import {
    computeFlipbookPageLabel,
    computeFlipbookSpreadAnnouncement,
    computeFlipbookStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FLIPBOOK_PAGES,
    FLIPBOOK_STEP_CAPTIONS,
} from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { FlipbookExampleProps } from "../FlipbookPage.types";

const BOOK_GAP = 10;
const FIRST_PAGE = 0;

type Props = FlipbookExampleProps;

const renderControls = (controls: FlipbookControls) => (
    <div class={styles.controls}>
        {controls.renderStep("previous")}
        {controls.renderStep("next")}
    </div>
);

export const BookExample = (props: Props) => (
    <div class={styles.stage}>
        <div class={styles.book}>
            <Flipbook
                pages={FLIPBOOK_PAGES}
                index={props.index}
                transitionDurationMs={props.transitionDurationMs}
                gap={() => BOOK_GAP}
                ariaLabel={"A book of hinges"}
                computePageLabel={computeFlipbookPageLabel}
                computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
                computeStepLabel={computeFlipbookStepLabel}
                renderPage={(getPage, getState) => (
                    <div
                        class={styles.page}
                        classList={{
                            [styles.pageLeft]: getState().side === "left",
                            [styles.pageRight]: getState().side === "right",
                            [styles.cover]:
                                getState().index === FIRST_PAGE || getState().index === getState().count - 1,
                        }}
                    >
                        <div class={styles.pageHeading}>{getPage().heading}</div>
                        <div class={styles.pageText}>{getPage().text}</div>
                        <div class={styles.pageNumber}>{getState().index + 1}</div>
                    </div>
                )}
                renderStep={(getStep, getRenderProps) => (
                    <PageButtonContent flags={getRenderProps}>{FLIPBOOK_STEP_CAPTIONS[getStep()]}</PageButtonContent>
                )}
                renderControls={renderControls}
            />
        </div>
    </div>
);
