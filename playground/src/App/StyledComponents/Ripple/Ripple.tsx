import { For, createEffect, createSignal, onCleanup } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { RippleMark, RippleProps } from "./Ripple.types";

import * as styles from "./Ripple.css";

const RIPPLE_DURATION_MS = 600;
const RATIO_TO_PERCENT = 100;

export const PageRipple = (props: RippleProps) => {
    const [getMarks, setMarks] = createSignal<RippleMark[]>([]);

    createEffect<number | undefined>((previousCount) => {
        const activation = access(props.activation);

        if (activation === undefined || activation.count === previousCount) return activation?.count;

        const mark: RippleMark = activation;

        setMarks((prev) => [...prev, mark]);

        const timeout = setTimeout(
            () => setMarks((prev) => prev.filter((entry) => entry !== mark)),
            RIPPLE_DURATION_MS,
        );

        onCleanup(() => {
            clearTimeout(timeout);
        });

        return activation.count;
    });

    return (
        <div class={styles.rippleRoot} style={{ color: access(props.color) }} aria-hidden="true">
            <For each={getMarks()}>
                {(mark) => (
                    <div
                        class={styles.rippleMark}
                        style={{
                            "left": `${mark.ratio.x * RATIO_TO_PERCENT}%`,
                            "top": `${mark.ratio.y * RATIO_TO_PERCENT}%`,
                            "animation-duration": `${RIPPLE_DURATION_MS}ms`,
                        }}
                    />
                )}
            </For>
        </div>
    );
};
