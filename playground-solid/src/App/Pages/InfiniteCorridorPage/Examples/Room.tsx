import type { Accessor } from "solid-js";

import type { InfiniteCorridorItemState } from "@thewaver/ss-components-solid";
import { HUE_STEP_DEGREES } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

type Props = {
    name: Accessor<string>;
    state: Accessor<InfiniteCorridorItemState>;
};

export const Room = (props: Props) => {
    return (
        <button
            type="button"
            class={styles.room}
            style={{ "background-color": `hsl(${props.state().index * HUE_STEP_DEGREES} 55% 28%)` }}
        >
            {props.name()}
        </button>
    );
};
