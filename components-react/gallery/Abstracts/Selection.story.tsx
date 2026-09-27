import { useState } from "react";

import { SelectionReactUtils } from "../../src";

const ITEMS = ["a", "b", "c", "d", "e"];

export const Default = () => {
    const selectionState = useState<string[]>([]);
    const { anchor, pick } = SelectionReactUtils.useSelection(false, {
        mode: "multiple",
        items: ITEMS,
        selectionState,
    });

    return (
        <>
            {ITEMS.map((item) => (
                <button
                    key={item}
                    type="button"
                    data-testid={item}
                    onClick={(e) => pick(item, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey })}
                >
                    {item}
                </button>
            ))}
            <output data-readout="selection">{selectionState[0].join(",")}</output>
            <output data-readout="anchor">{anchor ?? ""}</output>
        </>
    );
};
