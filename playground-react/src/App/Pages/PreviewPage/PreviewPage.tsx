import { useState } from "react";

import {
    COLLAPSED_HEIGHT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    LONG_PARAGRAPHS,
    SHORT_PARAGRAPHS,
} from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { ScrolledExample } from "./Examples/Scrolled";
import { TextExample } from "./Examples/Text";

export const PreviewPage = () => {
    const longState = useState(false);
    const shortState = useState(false);
    const scrolledState = useState(false);

    const examples = [
        {
            key: "long",
            name: EXAMPLE_NAMES.long,
            readout: () => `expanded: ${longState[0]} — the control appears because there is something behind it`,
            component: () => (
                <TextExample expanded={longState} collapsedHeight={COLLAPSED_HEIGHT} paragraphs={LONG_PARAGRAPHS} />
            ),
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the preview keeps whether it is expanded itself, so the page has nothing to show here",
            component: () => <TextExample collapsedHeight={COLLAPSED_HEIGHT} paragraphs={LONG_PARAGRAPHS} />,
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "short",
            name: EXAMPLE_NAMES.short,
            readout: () => `expanded: ${shortState[0]} — same component, same height, no control and no fade at all`,
            component: () => (
                <TextExample expanded={shortState} collapsedHeight={COLLAPSED_HEIGHT} paragraphs={SHORT_PARAGRAPHS} />
            ),
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `expanded: ${scrolledState[0]} — closing it brings the control back rather than leaving you further down`,
            component: () => (
                <ScrolledExample
                    expanded={scrolledState}
                    collapsedHeight={COLLAPSED_HEIGHT}
                    paragraphs={LONG_PARAGRAPHS}
                />
            ),
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
