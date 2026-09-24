import { createMemo, createSignal } from "solid-js";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { TableOfContentsExample } from "./Examples/TableOfContents";
import { OUTLINE_SECTIONS, SECTIONS } from "./TableOfContentsPage.const";
import type { TableOfContentsSection } from "./TableOfContentsPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TableOfContentsPage/Examples";
const PERCENT = 100;

const titleOf = (sections: TableOfContentsSection[], id: string | undefined) =>
    sections.find((section) => section.id === id)?.title ?? "none";

export const TableOfContentsPage = () => {
    const [getCurrent, setCurrent] = createSignal<string | undefined>();
    const [getOutlineCurrent, setOutlineCurrent] = createSignal<string | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "tableOfContents",
            name: "Following the page",
            readout: () =>
                `current: ${titleOf(SECTIONS, getCurrent())} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the window, and pressing a link scrolls to its heading and focuses it`,
            component: () => (
                <TableOfContentsExample sections={SECTIONS} ariaLabel={"On this page"} onCurrentChange={setCurrent} />
            ),
            path: `${EXAMPLES_ROOT}/TableOfContents.tsx`,
        },
        {
            key: "outline",
            name: "Sub-sections indented under their section",
            readout: () =>
                `current: ${titleOf(OUTLINE_SECTIONS, getOutlineCurrent())} — each link carries a depth the painter indents by, and the list stays flat for the keyboard and a screen reader`,
            component: () => (
                <TableOfContentsExample
                    sections={OUTLINE_SECTIONS}
                    ariaLabel={"Outline"}
                    onCurrentChange={setOutlineCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/TableOfContents.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} layout={"flow"} />;
};
