import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import type { PageMeasureBoxProps } from "./MeasureBox.types";

const NO_PADDING = 0;
const FILLING_WIDTH = "100%";

export const PageMeasureBox = (props: PropsWithChildren<PageMeasureBoxProps>) => {
    const getWidth = () => {
        if (props.isFilling) return FILLING_WIDTH;

        return props.width === undefined ? undefined : `${props.width}px`;
    };

    return (
        <div
            className={styles.measureBoxRoot}
            data-measure-box=""
            style={{
                width: getWidth(),
                height: props.height && `${props.height}px`,
                padding: `${props.padding ?? NO_PADDING}px`,
            }}
        >
            {props.children}
        </div>
    );
};
