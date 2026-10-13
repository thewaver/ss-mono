import { createMemo, createSignal } from "solid-js";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-solid";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PERCENT,
    SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { TableOfContentsExample } from "./Examples/TableOfContents";

export const TableOfContentsPage = () => {
    const [getCurrent, setCurrent] = createSignal<string | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "tableOfContents",
            name: EXAMPLE_NAMES.tableOfContents,
            readout: () =>
                `current: ${SECTIONS.find((section) => section.id === getCurrent())?.title ?? "none"} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the box it scrolls in. Pressing a link scrolls only that box to its heading and focuses it, and each link's depth is indented by the painter while the list stays flat for the keyboard and a screen reader`,
            component: () => (
                <TableOfContentsExample sections={SECTIONS} ariaLabel={"Outline"} onCurrentChange={setCurrent} />
            ),
            path: `${EXAMPLES_ROOT}/TableOfContents.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} minColumnWidth={520} />;
};
