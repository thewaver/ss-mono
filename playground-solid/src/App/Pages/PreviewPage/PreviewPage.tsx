import { createMemo, createSignal } from "solid-js";

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
    const longSignal = createSignal(false);
    const shortSignal = createSignal(false);
    const scrolledSignal = createSignal(false);

    const getExamples = createMemo(() => [
        {
            key: "long",
            name: EXAMPLE_NAMES.long,
            readout: () => `expanded: ${longSignal[0]()} — the control appears because there is something behind it`,
            component: () => (
                <TextExample
                    expanded={longSignal}
                    collapsedHeight={() => COLLAPSED_HEIGHT}
                    paragraphs={() => LONG_PARAGRAPHS}
                />
            ),
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the preview keeps whether it is expanded itself, so the page has nothing to show here",
            component: () => (
                <TextExample collapsedHeight={() => COLLAPSED_HEIGHT} paragraphs={() => LONG_PARAGRAPHS} />
            ),
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "short",
            name: EXAMPLE_NAMES.short,
            readout: () => `expanded: ${shortSignal[0]()} — same component, same height, no control and no fade at all`,
            component: () => (
                <TextExample
                    expanded={shortSignal}
                    collapsedHeight={() => COLLAPSED_HEIGHT}
                    paragraphs={() => SHORT_PARAGRAPHS}
                />
            ),
            path: `${EXAMPLES_ROOT}/Text.tsx`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `expanded: ${scrolledSignal[0]()} — closing it brings the control back rather than leaving you further down`,
            component: () => (
                <ScrolledExample
                    expanded={scrolledSignal}
                    collapsedHeight={() => COLLAPSED_HEIGHT}
                    paragraphs={() => LONG_PARAGRAPHS}
                />
            ),
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
