import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";
import type { SelectGroupFlags } from "@thewaver/ss-components";

import type { SelectGroupContentProps } from "./SelectGroupContent.types";

import * as styles from "./SelectGroupContent.css";

const CHECKED_MARK = "✓";
const MIXED_MARK = "–";

export const PageSelectGroupContent = (props: ParentProps<SelectGroupContentProps>) => {
    const getFlags = () => (props.flags === undefined ? undefined : access(props.flags));

    return (
        <div
            class={styles.selectGroupContent}
            data-checked-state={getFlags() === undefined ? undefined : String(getFlags()!.checkedState)}
            aria-hidden="true"
        >
            <Show when={getFlags()}>
                {(getGroupFlags: () => SelectGroupFlags) => (
                    <div
                        class={styles.selectGroupMark}
                        classList={{
                            [styles.isChecked]: getGroupFlags().checkedState === true,
                            [styles.isMixed]: getGroupFlags().checkedState === "mixed",
                        }}
                    >
                        {getGroupFlags().checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                    </div>
                )}
            </Show>

            {props.children}
        </div>
    );
};
