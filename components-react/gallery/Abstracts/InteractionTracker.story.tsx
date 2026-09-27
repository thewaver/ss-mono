import { useRef, useState } from "react";

import { InteractionTrackerReactUtils } from "../../src";

export const Flags = ({ isDisabled = false }: { isDisabled?: boolean }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const flags = InteractionTrackerReactUtils.useElementFlags(ref, isDisabled);
    const [count, setCount] = useState(0);

    InteractionTrackerReactUtils.useActivation(ref, isDisabled, (activation) => setCount(activation.count));

    return (
        <>
            <button ref={ref} type="button" data-testid="control">
                Control
            </button>
            <output data-readout="hovered">{String(flags.isHovered)}</output>
            <output data-readout="focusVisible">{String(flags.isFocusVisible ?? false)}</output>
            <output data-readout="activations">{count}</output>
        </>
    );
};

export const Drag = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [ratio, setRatio] = useState({ x: 0, y: 0 });
    const [ended, setEnded] = useState("none");
    const { isDragging } = InteractionTrackerReactUtils.useDrag(ref, false, {
        onDrag: setRatio,
        onDragEnd: setEnded,
    });
    const [, rerender] = useState(0);

    return (
        <>
            <div ref={ref} data-testid="track" style={{ width: 200, height: 100, background: "#ddd" }} />
            <button type="button" data-testid="rerender" onClick={() => rerender((tick) => tick + 1)}>
                Rerender
            </button>
            <output data-readout="ratio">{`${ratio.x.toFixed(1)} ${ratio.y.toFixed(1)}`}</output>
            <output data-readout="dragging">{String(isDragging)}</output>
            <output data-readout="ended">{ended}</output>
        </>
    );
};

export const Swipe = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [direction, setDirection] = useState("none");
    const [clicks, setClicks] = useState(0);

    InteractionTrackerReactUtils.useAxialSwipe(ref, false, {
        axis: "horizontal",
        commitRatio: 0.3,
        onSwipe: () => {},
        onSwipeEnd: (committed) => setDirection(String(committed)),
    });

    return (
        <>
            <div
                ref={ref}
                data-testid="card"
                style={{ width: 300, height: 100, background: "#ddd" }}
                onClick={() => setClicks((count) => count + 1)}
            />
            <output data-readout="direction">{direction}</output>
            <output data-readout="clicks">{clicks}</output>
        </>
    );
};

export const Hold = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isHeld = InteractionTrackerReactUtils.useHold(ref);

    return (
        <>
            <div ref={ref} data-testid="box" style={{ width: 200, height: 100, background: "#ddd" }} />
            <div data-testid="away" style={{ marginTop: 100 }}>
                Away
            </div>
            <output data-readout="held">{String(isHeld)}</output>
        </>
    );
};
