import { Index, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import { FITTED_TEXT_DEFAULTS, FittedTextUtils, FittedTextStyles as styles } from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { FittedTextProps } from "./FittedTextSolid.types";

export const FittedText = (props: FittedTextProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getLines = createMemo(() => access(props.lines));

    const getLineHeightRatio = createMemo(() => access(props.lineHeightRatio) ?? FITTED_TEXT_DEFAULTS.lineHeightRatio);

    const layout = FittedTextUtils.createLayout({
        getLines: () => untrack(getLines),
        getLineHeightRatio: () => untrack(getLineHeightRatio),
    });

    const getFontSizes = accessStore(layout, (state) => state.fontSizes);

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        onCleanup(layout.observe(root));
    });

    createEffect(on([getLines, getLineHeightRatio], () => layout.update(), { defer: true }));

    onMount(() => {
        props.onMount?.({ update: layout.update });
    });

    return (
        <div ref={setRootRef} class={styles.fittedTextRoot}>
            <Index each={getLines()}>
                {(getLine, index) => (
                    <span
                        class={styles.fittedTextLine}
                        style={{
                            "font-size": `${getFontSizes()[index] ?? 0}px`,
                            "line-height": getLineHeightRatio(),
                        }}
                    >
                        {getLine()}
                    </span>
                )}
            </Index>
        </div>
    );
};
