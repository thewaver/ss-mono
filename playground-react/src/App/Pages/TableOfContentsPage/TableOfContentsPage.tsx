import { useState } from "react";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-react";
import {
    OUTLINE_SECTIONS,
    SECTIONS,
} from "@thewaver/ss-playground-core/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import type { TableOfContentsSection } from "@thewaver/ss-playground-core/App/Pages/TableOfContentsPage/TableOfContentsSection.types";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { TableOfContentsExample } from "./Examples/TableOfContents";

const EXAMPLES_ROOT = "/src/App/Pages/TableOfContentsPage/Examples";
const PERCENT = 100;

const titleOf = (sections: TableOfContentsSection[], id: string | undefined) =>
    sections.find((section) => section.id === id)?.title ?? "none";

export const TableOfContentsPage = () => {
    const [current, setCurrent] = useState<string | undefined>();
    const [outlineCurrent, setOutlineCurrent] = useState<string | undefined>();

    const examples = [
        {
            key: "tableOfContents",
            name: "Following the page",
            readout: () =>
                `current: ${titleOf(SECTIONS, current)} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the window, and pressing a link scrolls to its heading and focuses it`,
            component: () => (
                <TableOfContentsExample sections={SECTIONS} ariaLabel={"On this page"} onCurrentChange={setCurrent} />
            ),
            path: `${EXAMPLES_ROOT}/TableOfContents.tsx`,
        },
        {
            key: "outline",
            name: "Sub-sections indented under their section",
            readout: () =>
                `current: ${titleOf(OUTLINE_SECTIONS, outlineCurrent)} — each link carries a depth the painter indents by, and the list stays flat for the keyboard and a screen reader`,
            component: () => (
                <TableOfContentsExample
                    sections={OUTLINE_SECTIONS}
                    ariaLabel={"Outline"}
                    onCurrentChange={setOutlineCurrent}
                />
            ),
            path: `${EXAMPLES_ROOT}/TableOfContents.tsx`,
        },
    ];

    return <PageExamples items={examples} layout={"flow"} />;
};
