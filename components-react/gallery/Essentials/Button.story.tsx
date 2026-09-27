import { useState } from "react";

import { Button, Label } from "../../src";

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: (
        _visibilityTarget: 0 | 1,
        _durationMs: number,
        _placement: unknown,
        flags: { isDisabled?: boolean },
    ) => <span>{`isDisabled: ${String(flags.isDisabled ?? false)}`}</span>,
} as const;

export const Default = ({
    isDisabled = false,
    isReachable = false,
}: {
    isDisabled?: boolean;
    isReachable?: boolean;
}) => {
    const [clicks, setClicks] = useState(0);

    return (
        <>
            <Button
                id="button"
                isDisabled={isDisabled}
                isReachableWhenDisabled={isReachable}
                tooltipDefs={isReachable ? TOOLTIP_DEFS : undefined}
                renderContent={(flags) => <span>{flags.isHovered ? "Hovered" : "Press"}</span>}
                onClick={() => setClicks((count) => count + 1)}
            />
            <output data-readout="clicks">{clicks}</output>
        </>
    );
};

export const Pressed = () => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <>
            <Button
                id="button"
                isPressed={isPressed}
                tooltipDefs={TOOLTIP_DEFS}
                renderContent={() => <span>Toggle</span>}
                onClick={() => setIsPressed((was) => !was)}
            />
            <output data-readout="pressed">{String(isPressed)}</output>
        </>
    );
};

export const Pending = () => {
    const [clicks, setClicks] = useState(0);
    const [release, setRelease] = useState<() => void>();

    return (
        <>
            <Button
                id="button"
                renderContent={(flags) => <span>{flags.isPending ? "Working" : "Save"}</span>}
                onClick={() => {
                    setClicks((count) => count + 1);

                    return new Promise<void>((resolve) => setRelease(() => resolve));
                }}
            />
            <button type="button" data-testid="release" onClick={() => release?.()}>
                Release
            </button>
            <output data-readout="clicks">{clicks}</output>
        </>
    );
};

export const Labeled = () => (
    <Label>
        <span>Caption</span>
        <Button id="button" ariaLabel="Ignored" renderContent={() => <span>Go</span>} />
    </Label>
);
