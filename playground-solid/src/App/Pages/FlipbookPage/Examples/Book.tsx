import { For, Show, createSignal } from "solid-js";

import { Button, Flipbook } from "@thewaver/ss-components-solid";
import type { FlipbookControls, FlipbookStep } from "@thewaver/ss-components-solid";
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

const renderControls = (controls: FlipbookControls) => (
    <div class={styles.controls}>
        <For each={STEPS}>
            {(step) => (
                <Button
                    ariaLabel={computeFlipbookStepLabel(step)}
                    isDisabled={() => !controls.getCanTurn(step)}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={() => CONTROL_GLYPHS[step]} />
                    )}
                    onClick={() => {
                        controls.turn(step);
                    }}
                />
            )}
        </For>
    </div>
);

export const BookExample = (props: Props) => {
    const [getControls, setControls] = createSignal<FlipbookControls>();

    return (
        <div class={styles.stage}>
            <div class={styles.book}>
                <PageMeasureBox isFilling height={styles.BOOK_HEIGHT}>
                    <Flipbook
                        pages={FLIPBOOK_PAGES}
                        index={props.index}
                        transitionDurationMs={props.transitionDurationMs}
                        ariaLabel={"A book of hinges"}
                        computePageLabel={computeFlipbookPageLabel}
                        computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
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
                        onMount={setControls}
                    />
                </PageMeasureBox>
            </div>

            <Show when={getControls()}>{(getBookControls) => renderControls(getBookControls())}</Show>
        </div>
    );
};
