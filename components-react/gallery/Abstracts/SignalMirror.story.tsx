import { useState } from "react";

import { SignalMirrorReactUtils } from "../../src";

const MAX = 5;

export const Default = () => {
    const [outer, setOuter] = useState(1);
    const [inner, setInner] = SignalMirrorReactUtils.useValueMirror(outer, (next) => setOuter(Math.min(next, MAX)));
    const [optional, setOptional] = SignalMirrorReactUtils.useOptionalState(undefined, 7);

    return (
        <>
            <button type="button" data-testid="ten" onClick={() => setInner(10)}>
                Ten
            </button>
            <button type="button" data-testid="optional" onClick={() => setOptional(8)}>
                Optional
            </button>
            <output data-readout="outer">{outer}</output>
            <output data-readout="inner">{inner}</output>
            <output data-readout="optional">{optional}</output>
        </>
    );
};
