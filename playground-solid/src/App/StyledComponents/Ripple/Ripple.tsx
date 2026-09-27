import { For, createEffect, createSignal, onCleanup } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/Ripple/Ripple.css";

import type { RippleMark, RippleProps } from "./Ripple.types";

const RIPPLE_DURATION_MS = 600;
const RATIO_TO_PERCENT = 100;

export const PageRipple = (props: RippleProps) => {
    const [getMarks, setMarks] = createSignal<RippleMark[]>([]);
    const timeouts = new Set<ReturnType<typeof setTimeout>>();

    onCleanup(() => timeouts.forEach(clearTimeout));

    createEffect<number | undefined>((previousCount) => {
        const activation = access(props.activation);

        if (activation === undefined || activation.count === previousCount) return activation?.count;

        const mark: RippleMark = activation;

        setMarks((prev) => [...prev, mark]);

        const timeout = setTimeout(() => {
            timeouts.delete(timeout);
            setMarks((prev) => prev.filter((entry) => entry !== mark));
        }, RIPPLE_DURATION_MS);

        timeouts.add(timeout);

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
