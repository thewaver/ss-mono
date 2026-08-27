import { For, createEffect, createSignal } from "solid-js";

import { InteractionTracker } from "@thewaver/ss-components";

import type { InteractionFlagsExampleProps } from "../InteractionTrackerPage.types";

import * as styles from "../InteractionTrackerPage.css";

const FLAG_NAMES = ["isHovered", "isFocused", "isActive"] as const;

type Props = InteractionFlagsExampleProps;

export const FlagsExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getFlags } = InteractionTracker.wrapElement(getRef, props.isDisabled, {
        applyButtonSemantics: true,
        getIsReachable: props.isReachable,
    });

    createEffect(() => {
        props.onFlagsChange(getFlags());
    });

    return (
        <div class={styles.stage}>
            <div ref={setRef} class={styles.flagTarget}>
                A div the tracker made into a button
            </div>

            <div class={styles.flagList}>
                <For each={FLAG_NAMES}>
                    {(name) => (
                        <span class={`${styles.flagChip} ${getFlags()[name] ? styles.flagChipOn : ""}`}>{name}</span>
                    )}
                </For>
            </div>
        </div>
    );
};
