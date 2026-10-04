import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { FITTED_TEXT_DEFAULTS, FittedTextStyles, FittedTextUtils } from "@thewaver/ss-components";

import { useLatest, useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { FittedTextProps } from "./FittedText.types";

export const FittedText = (props: FittedTextProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    const lineHeightRatio = props.lineHeightRatio ?? FITTED_TEXT_DEFAULTS.lineHeightRatio;
    const lines = useStableList(props.lines);

    const latest = useLatest({ lines, lineHeightRatio, onMount: props.onMount });

    const [layout] = useState(() =>
        FittedTextUtils.createLayout({
            getLines: () => latest.current.lines,
            getLineHeightRatio: () => latest.current.lineHeightRatio,
        }),
    );

    const fontSizes = useStore(layout, (state) => state.fontSizes);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        return layout.observe(root);
    }, [layout]);

    useLayoutEffect(() => {
        layout.update();
    }, [layout, lines, lineHeightRatio]);

    useEffect(() => {
        latest.current.onMount?.({ update: layout.update });
    }, [layout, latest]);

    return (
        <div ref={rootRef} className={FittedTextStyles.fittedTextRoot}>
            {lines.map((line, index) => (
                <span
                    key={index}
                    className={FittedTextStyles.fittedTextLine}
                    style={{ fontSize: `${fontSizes[index] ?? 0}px`, lineHeight: lineHeightRatio }}
                >
                    {line}
                </span>
            ))}
        </div>
    );
};
