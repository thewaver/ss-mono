import { useEffect, useRef, useState } from "react";

import { ElementFaderReactUtils } from "../../src";

export const Default = ({
    transitionDurationMs = 300,
    cssDurationMs = transitionDurationMs,
}: {
    transitionDurationMs?: number;
    cssDurationMs?: number;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const committedAtRef = useRef<HTMLOutputElement>(null);
    const finishedAtRef = useRef<HTMLOutputElement>(null);

    const fader = ElementFaderReactUtils.useFader(isOpen, { transitionDurationMs, ref });

    useEffect(() => {
        committedAtRef.current!.dataset.at = String(performance.now());
    }, [fader.transitionTarget]);

    useEffect(() => {
        if (fader.hasTransitionFinished) finishedAtRef.current!.dataset.at = String(performance.now());
    }, [fader.hasTransitionFinished]);

    return (
        <>
            <button type="button" onClick={() => setIsOpen((wasOpen) => !wasOpen)}>
                Toggle
            </button>
            <output data-readout="isVisible">{String(fader.isVisible)}</output>
            <output data-readout="transitionTarget" ref={committedAtRef}>
                {fader.transitionTarget}
            </output>
            <output data-readout="hasTransitionFinished" ref={finishedAtRef}>
                {String(fader.hasTransitionFinished)}
            </output>
            {fader.isVisible && (
                <div
                    ref={ref}
                    data-testid="layer"
                    style={{ opacity: fader.transitionTarget, transition: `opacity ${cssDurationMs}ms linear` }}
                >
                    Layer
                </div>
            )}
        </>
    );
};
