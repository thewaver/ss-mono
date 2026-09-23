import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { PageMeasureBoxProps } from "./MeasureBox.types";

import * as styles from "./MeasureBox.css";

const NO_PADDING = 0;
const FILLING_WIDTH = "100%";

export const PageMeasureBox = (props: ParentProps<PageMeasureBoxProps>) => {
    const getWidth = () => {
        if (access(props.isFilling)) return FILLING_WIDTH;

        return props.width === undefined ? undefined : `${access(props.width)}px`;
    };

    return (
        <div
            class={styles.measureBoxRoot}
            data-measure-box
            style={{
                width: getWidth(),
                height: props.height && `${access(props.height)}px`,
                padding: `${access(props.padding) ?? NO_PADDING}px`,
            }}
        >
            {props.children}
        </div>
    );
};
