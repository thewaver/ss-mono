import { useRef, useState } from "react";

import { TextSyncUtils } from "@thewaver/ss-components";

import { TextSyncReactUtils } from "../../src";

const PATTERN = "##/##";

export const Default = () => {
    const [value, setValue] = useState("");
    const ref = useRef<HTMLInputElement>(null);

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncReactUtils.useValueSync(ref, value, {
        onInput: setValue,
        computeMaskedText: (previous, next, caret) => TextSyncUtils.applyMask(PATTERN, previous, next, caret),
    });

    return (
        <>
            <input
                ref={ref}
                data-testid="field"
                onInput={(e) => handleInput(e.currentTarget)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget)}
            />
            <button type="button" onClick={() => setValue("98/76")}>
                Set
            </button>
            <output data-readout="value">{value}</output>
        </>
    );
};
