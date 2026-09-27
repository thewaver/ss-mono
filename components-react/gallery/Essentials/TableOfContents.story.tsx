import { useState } from "react";

import type { TableOfContentsLink } from "@thewaver/ss-components";

import { TableOfContents } from "../../src";

type Section = { id: string; title: string; depth?: number };

const SECTIONS: Section[] = [
    { id: "tocPlanting", title: "Planting" },
    { id: "tocEarthingUp", title: "Earthing up" },
    { id: "tocWatering", title: "Watering" },
    { id: "tocHarvest", title: "Harvest" },
    { id: "tocStorage", title: "Storage" },
];

const OUTLINE_SECTIONS: Section[] = [
    { id: "outlineSoil", title: "Soil" },
    { id: "outlineTesting", title: "Testing", depth: 1 },
    { id: "outlineFeeding", title: "Feeding", depth: 1 },
    { id: "outlineSeed", title: "Seed potatoes" },
    { id: "outlineChitting", title: "Chitting", depth: 1 },
];

const INDENT_PX = 12;

const Contents = ({ scope, sections, ariaLabel }: { scope: string; sections: Section[]; ariaLabel: string }) => {
    const [headings, setHeadings] = useState<(HTMLElement | undefined)[]>([]);
    const [current, setCurrent] = useState<string>();

    const [headingRefs] = useState(() =>
        sections.map(
            (_section, index) => (element: HTMLElement | null) =>
                setHeadings((previous) => {
                    if (previous[index] === (element ?? undefined)) return previous;

                    const next = [...previous];

                    next[index] = element ?? undefined;

                    return next;
                }),
        ),
    );

    const links: TableOfContentsLink<string>[] = sections.map((section, index) => ({
        value: section.id,
        target: headings[index],
        href: `#${section.id}`,
        depth: section.depth,
        id: `${section.id}Link`,
    }));

    return (
        <div data-testid={scope} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 20, width: 720 }}>
            <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
                <TableOfContents
                    links={links}
                    gap={5}
                    ariaLabel={ariaLabel}
                    renderLink={(link) => (
                        <span style={{ display: "block", paddingInlineStart: (link.depth ?? 0) * INDENT_PX }}>
                            {sections.find((section) => section.id === link.value)?.title}
                        </span>
                    )}
                    onCurrentChange={setCurrent}
                />
                <output data-readout="current">{`current: ${sections.find((section) => section.id === current)?.title ?? "none"}`}</output>
            </div>

            <article style={{ display: "flex", flexDirection: "column", gap: 40, paddingBottom: "70vh" }}>
                {sections.map((section, index) => (
                    <section key={section.id} aria-labelledby={section.id} style={{ minHeight: 320 }}>
                        <h3 ref={headingRefs[index]} id={section.id} style={{ margin: 0 }}>
                            {section.title}
                        </h3>
                        <p>{`The ${section.title.toLowerCase()} section.`}</p>
                    </section>
                ))}
            </article>
        </div>
    );
};

export const Default = () => (
    <div data-testid="scroller" style={{ height: "100vh", overflowY: "auto" }}>
        <div style={{ height: 400 }} />
        <Contents scope="tableOfContents" sections={SECTIONS} ariaLabel={"On this page"} />
    </div>
);

export const Outline = () => (
    <div data-testid="scroller" style={{ height: "100vh", overflowY: "auto" }}>
        <Contents scope="outline" sections={OUTLINE_SECTIONS} ariaLabel={"Outline"} />
    </div>
);
