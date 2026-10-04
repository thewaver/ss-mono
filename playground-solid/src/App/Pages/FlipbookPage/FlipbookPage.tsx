import { createMemo, createSignal } from "solid-js";

import { FLIPBOOK_DEFAULTS, FlipbookUtils, MediaQueryMonitorSolidUtils } from "@thewaver/ss-components-solid";
import { FlipbookKnobs } from "@thewaver/ss-playground/App/Knobs/Flipbooks.const";
import { computeFlipbookSpreadAnnouncement } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BookExample } from "./Examples/Book";

const NO_MOTION_DURATION_MS = 0;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/FlipbookPage/Examples";

export const FlipbookPage = () => {
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(FLIPBOOK_DEFAULTS.transitionDurationMs);

    const indexSignal = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getTurnDurationMs = () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getTransitionDurationMs());

    const getExamples = createMemo(() => [
        {
            key: "book",
            name: "A book of twelve pages",
            readout: () => {
                const count = FLIPBOOK_PAGES.length;
                const pages = FlipbookUtils.getShowingPages(indexSignal[0](), count);

                return `open at ${computeFlipbookSpreadAnnouncement(pages, count)} — turn it with the buttons, with the arrow keys while the book has focus, or by dragging a page across`;
            },
            component: () => <BookExample index={indexSignal} transitionDurationMs={getTurnDurationMs} />,
            path: `${EXAMPLES_ROOT}/Book.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={
                        "How long one page takes to turn over. It is off while the visitor has asked for reduced motion, and the pages then turn at once."
                    }
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => FlipbookKnobs.MIN_DURATION_MS}
                        max={() => FlipbookKnobs.MAX_DURATION_MS}
                        step={() => FlipbookKnobs.DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
