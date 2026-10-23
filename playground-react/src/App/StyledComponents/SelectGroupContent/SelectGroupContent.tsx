import type { PropsWithChildren } from "react";

import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectGroupContentProps } from "./SelectGroupContentReact.types";

export const PageSelectGroupBox = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.selectGroupBox, layerClass].join(" ")}>{props.children}</div>;
};

export const PageSelectGroupContent = (props: PropsWithChildren<SelectGroupContentProps>) => {
    const layerClass = useLayerClass();

    const flags = props.flags;

    return (
        <div
            className={[styles.selectGroupContent, layerClass].join(" ")}
            data-checked-state={flags === undefined ? undefined : String(flags.checkedState)}
            aria-hidden="true"
        >
            {flags && (
                <div
                    className={[
                        styles.selectGroupMark,
                        flags.checkedState === true && styles.isChecked,
                        flags.checkedState === "mixed" && styles.isMixed,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            )}

            {props.children}
        </div>
    );
};
