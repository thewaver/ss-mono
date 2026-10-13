import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { FILLING_WIDTH, NO_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import type { PageMeasureBoxProps } from "./MeasureBox.types";

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
