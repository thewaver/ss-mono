import type { InfiniteCorridorItemState } from "@thewaver/ss-components-react";
import { HUE_STEP_DEGREES } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

type Props = {
    name: string;
    state: InfiniteCorridorItemState;
};

export const Room = (props: Props) => {
    return (
        <button
            type="button"
            className={styles.room}
            style={{ backgroundColor: `hsl(${props.state.index * HUE_STEP_DEGREES} 55% 28%)` }}
        >
            {props.name}
        </button>
    );
};
