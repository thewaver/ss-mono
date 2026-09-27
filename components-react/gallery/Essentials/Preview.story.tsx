import { useState } from "react";

import { Preview } from "../../src";

const COLLAPSED_HEIGHT = 120;
const SCROLL_BOX_HEIGHT = 200;
const PANEL_WIDTH = 320;
const FADE_HEIGHT = 40;

const LONG_PARAGRAPHS = [
    "The castle was begun in the twelfth century on a ridge above the river crossing.",
    "Its first keep was timber, replaced in stone within a generation, and the curtain wall followed.",
    "The east tower was added when the town below had grown enough to need watching from above.",
    "Later owners softened it into a house, cutting windows into walls built to have none.",
    "What stands now is mostly the third rebuilding, with the old keep still at its heart.",
];

const SHORT_PARAGRAPHS = ["A short note that fits."];

const AFTERWARDS = [
    "The rest of the page carries on below, which is the whole of the problem.",
    "Open the preview, read to the end of it, and close it again: everything under it jumps up.",
    "With the scroll asked for, the box comes back to where you were standing.",
];

type TextProps = { paragraphs: string[]; isScrolledIntoViewOnCollapse?: boolean };

const Text = ({ paragraphs, isScrolledIntoViewOnCollapse }: TextProps) => {
    const expandedState = useState(false);

    return (
        <div style={{ width: PANEL_WIDTH }}>
            <Preview
                expandedState={expandedState}
                collapsedHeight={COLLAPSED_HEIGHT}
                isScrolledIntoViewOnCollapse={isScrolledIntoViewOnCollapse}
                renderContent={() => (
                    <div>
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                )}
                renderOverlay={(visibilityTarget, durationMs) => (
                    <div
                        data-testid="fade"
                        style={{
                            height: FADE_HEIGHT,
                            background: "linear-gradient(transparent, white)",
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    />
                )}
                renderTrigger={(flags) => <span>{flags.isExpanded ? "Show less" : "Read more"}</span>}
            />
            <output data-readout="expanded">{`expanded: ${String(expandedState[0])}`}</output>
        </div>
    );
};

export const Long = () => <Text paragraphs={LONG_PARAGRAPHS} />;

export const Short = () => (
    <div data-testid="short">
        <Text paragraphs={SHORT_PARAGRAPHS} />
    </div>
);

export const Uncontrolled = () => (
    <Preview
        collapsedHeight={COLLAPSED_HEIGHT}
        renderContent={() => (
            <div style={{ width: PANEL_WIDTH }}>
                {LONG_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        )}
        renderTrigger={(flags) => <span>{flags.isExpanded ? "Show less" : "Read more"}</span>}
    />
);

export const Scrolled = () => (
    <div data-scroll-box style={{ height: SCROLL_BOX_HEIGHT, overflowY: "auto" }}>
        <Text paragraphs={LONG_PARAGRAPHS} isScrolledIntoViewOnCollapse={true} />
        <div>
            {AFTERWARDS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
            ))}
        </div>
    </div>
);
