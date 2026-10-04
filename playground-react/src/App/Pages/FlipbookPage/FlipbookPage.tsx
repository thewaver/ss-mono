import { useState } from "react";

import { FLIPBOOK_DEFAULTS, FlipbookUtils, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
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
    const [transitionDurationMs, setTransitionDurationMs] = useState(FLIPBOOK_DEFAULTS.transitionDurationMs);

    const indexState = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const turnDurationMs = prefersReducedMotion ? NO_MOTION_DURATION_MS : transitionDurationMs;

    const examples = [
        {
            key: "book",
            name: "A book of twelve pages",
            readout: () => {
                const count = FLIPBOOK_PAGES.length;
                const pages = FlipbookUtils.getShowingPages(indexState[0], count);

                return `open at ${computeFlipbookSpreadAnnouncement(pages, count)} — turn it with the buttons, with the arrow keys while the book has focus, or by dragging a page across`;
            },
            component: () => <BookExample index={indexState} transitionDurationMs={turnDurationMs} />,
            path: `${EXAMPLES_ROOT}/Book.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={
                        "How long one page takes to turn over. It is off while the visitor has asked for reduced motion, and the pages then turn at once."
                    }
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={FlipbookKnobs.MIN_DURATION_MS}
                        max={FlipbookKnobs.MAX_DURATION_MS}
                        step={FlipbookKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
