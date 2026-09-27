import { useState } from "react";

import type { PopoverRole } from "@thewaver/ss-components";

import { Popover } from "../../src";

const POPOVER_ID = "popover";
const ANCHOR_WIDTH = 240;
const ANCHOR_COLOR = "rgb(200, 30, 60)";
const SCROLL_ROOM = 3000;
const OPTIONS = ["alpha", "beta"];

type DefaultProps = {
    role?: PopoverRole;
    hasAutoFocus?: boolean;
    hasAnchorMinWidth?: boolean;
    isTransparentToPointer?: boolean;
    isCovered?: boolean;
    isPinned?: boolean;
};

export const Default = ({
    role = "listbox",
    hasAutoFocus = false,
    hasAnchorMinWidth = false,
    isTransparentToPointer = false,
    isCovered = false,
    isPinned = false,
}: DefaultProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement>();
    const [reason, setReason] = useState("none");
    const [transitions, setTransitions] = useState<boolean[]>([]);
    const [keys, setKeys] = useState<string[]>([]);

    return (
        <div style={{ height: isPinned ? SCROLL_ROOM : undefined }}>
            <button
                type="button"
                data-testid="anchor"
                ref={(element) => setAnchor(element ?? undefined)}
                style={{ width: ANCHOR_WIDTH, color: ANCHOR_COLOR }}
                onClick={() => setIsOpen((was) => !was)}
            >
                Anchor
            </button>
            <button type="button" data-testid="outside">
                Outside
            </button>
            <output data-readout="reason">{reason}</output>
            <output data-readout="transitions">{transitions.join(",")}</output>
            <output data-readout="keys">{keys.join(",")}</output>
            <Popover
                id={POPOVER_ID}
                role={role}
                ariaAttributes={{ "aria-label": "Choices" }}
                isOpen={isOpen}
                anchorRef={anchor}
                hasAutoFocus={hasAutoFocus}
                hasAnchorMinWidth={hasAnchorMinWidth}
                isTransparentToPointer={isTransparentToPointer}
                isCovered={isCovered}
                isPinned={isPinned}
                onDismiss={(next) => {
                    setReason(next);
                    setIsOpen(false);
                }}
                onKeyDown={(e) => setKeys((previous) => [...previous, e.key])}
                onTransitionStatusChange={(next) =>
                    setTransitions((previous) => (previous.at(-1) === next ? previous : [...previous, next]))
                }
                renderContent={(visibilityTarget, durationMs, placement) => (
                    <div
                        data-testid="content"
                        data-placement={`${placement.x} ${placement.y}`}
                        style={{
                            background: "white",
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    >
                        {OPTIONS.map((option) => (
                            <button key={option} type="button" data-testid={option}>
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            />
        </div>
    );
};
