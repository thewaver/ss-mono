import { type ReactNode, useEffect, useState } from "react";

import type { AccordionItem } from "@thewaver/ss-components";

import { Accordion, Button } from "../../../src";

const GAP = 5;
const SCROLL_BOX_HEIGHT = 90;
const GROWING_DURATION_MS = 400;

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
    Unavailable: ["This section is disabled, so its header refuses to open it."],
    Assembly: [
        "Lay every part out before starting.",
        "Count the bolts against the list; there are four lengths and they are not interchangeable.",
        "The long bolts go through the side panels, the short ones into the base.",
        "Fit the back panel before the shelves, or it will not go in afterwards.",
        "Tighten everything by hand first.",
        "Stand it up, then go round again and tighten properly.",
        "Check it does not rock before loading it.",
        "Keep the spare washers; there is always one.",
        "This panel is taller than the box it sits in, so opening it puts its header at the top.",
    ],
};

const SECTION_ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Unavailable", isDisabled: true },
];

const SCROLLED_ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Assembly" },
];

const DEFERRED_ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

const GROWING_ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

const Header = ({ children }: { children: ReactNode }) => <span style={{ padding: 8 }}>{children}</span>;

const Panel = ({
    visibilityTarget,
    durationMs,
    children,
}: {
    visibilityTarget: 0 | 1;
    durationMs: number;
    children: ReactNode;
}) => <div style={{ padding: 8, opacity: visibilityTarget, transition: `opacity ${durationMs}ms` }}>{children}</div>;

type BuiltProps = { value: string; onBuild: (value: string) => void; children: ReactNode };

const Built = ({ value, onBuild, children }: BuiltProps) => {
    useEffect(() => onBuild(value), [value]);

    return <>{children}</>;
};

type SectionsProps = { isSingleExpand?: boolean; isExpandRequired?: boolean; initial?: string[] };

export const Sections = ({
    isSingleExpand = false,
    isExpandRequired = false,
    initial = ["Shipping"],
}: SectionsProps) => {
    const expandedState = useState<string[]>(initial);

    return (
        <>
            <Accordion
                items={SECTION_ITEMS}
                expandedState={expandedState}
                isSingleExpand={isSingleExpand}
                isExpandRequired={isExpandRequired}
                gap={GAP}
                renderHeader={(item) => <Header>{item.value}</Header>}
                renderPanel={(item, visibilityTarget, durationMs) => (
                    <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        {SECTION_BODIES[item.value].map((line) => (
                            <div key={line}>{line}</div>
                        ))}
                    </Panel>
                )}
            />
            <output data-readout="expanded">{JSON.stringify(expandedState[0])}</output>
        </>
    );
};

export const Uncontrolled = () => (
    <Accordion
        items={SECTION_ITEMS}
        renderHeader={(item) => <Header>{item.value}</Header>}
        renderPanel={(item, visibilityTarget, durationMs) => (
            <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                {SECTION_BODIES[item.value][0]}
            </Panel>
        )}
    />
);

export const Growing = () => {
    const expandedState = useState<string[]>(["Shipping"]);
    const [extraLines, setExtraLines] = useState(0);

    return (
        <Accordion
            items={GROWING_ITEMS}
            expandedState={expandedState}
            transitionDurationMs={GROWING_DURATION_MS}
            renderHeader={(item) => <Header>{item.value}</Header>}
            renderPanel={(_item, visibilityTarget, durationMs) => (
                <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                    <Button
                        id="addALine"
                        renderContent={() => <span>Add a line</span>}
                        onClick={() => setExtraLines((count) => count + 1)}
                    />
                    {Array.from({ length: extraLines }, (_unused, index) => (
                        <div key={index}>Line {index + 1} appeared after the panel was already open.</div>
                    ))}
                </Panel>
            )}
        />
    );
};

export const Scrolled = () => (
    <div data-scroll-box style={{ height: SCROLL_BOX_HEIGHT, overflowY: "auto" }}>
        <Accordion
            items={SCROLLED_ITEMS}
            isScrolledIntoViewOnExpand={true}
            gap={GAP}
            renderHeader={(item) => <Header>{item.value}</Header>}
            renderPanel={(item, visibilityTarget, durationMs) => (
                <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                    {SECTION_BODIES[item.value].map((line) => (
                        <div key={line}>{line}</div>
                    ))}
                </Panel>
            )}
        />
    </div>
);

export const Deferred = () => {
    const [built, setBuilt] = useState<string[]>([]);

    const handleBuild = (value: string) =>
        setBuilt((previous) => (previous.includes(value) ? previous : [...previous, value]));

    return (
        <>
            <Accordion
                items={DEFERRED_ITEMS}
                isPanelBuiltOnExpand={true}
                gap={GAP}
                renderHeader={(item) => <Header>{item.value}</Header>}
                renderPanel={(item, visibilityTarget, durationMs) => (
                    <Built value={item.value} onBuild={handleBuild}>
                        <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {SECTION_BODIES[item.value].map((line) => (
                                <div key={line} data-built={item.value}>
                                    {line}
                                </div>
                            ))}
                        </Panel>
                    </Built>
                )}
            />
            <output data-readout="built">{JSON.stringify(built)}</output>
        </>
    );
};
