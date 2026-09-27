import type { EdgeFaderEdge } from "@thewaver/ss-components";

import { EdgeFader } from "../../src";

const LINES = Array.from({ length: 30 }, (_, index) => `Line ${index + 1}`);

type StoryProps = {
    edges?: EdgeFaderEdge[];
    isScrollAware?: boolean;
    ariaLabel?: string;
    hasButton?: boolean;
    isShort?: boolean;
};

export const Default = ({ edges, isScrollAware, ariaLabel, hasButton, isShort }: StoryProps) => (
    <div data-testid="frame" style={{ width: 200, height: 200 }}>
        <EdgeFader edges={edges} size={40} isScrollAware={isScrollAware} ariaLabel={ariaLabel}>
            <div data-testid="content">
                {(isShort ? LINES.slice(0, 2) : LINES).map((line) => (
                    <p key={line} style={{ margin: 0, lineHeight: "20px" }}>
                        {line}
                    </p>
                ))}
                {hasButton && <button type="button">Inside</button>}
            </div>
        </EdgeFader>
    </div>
);
