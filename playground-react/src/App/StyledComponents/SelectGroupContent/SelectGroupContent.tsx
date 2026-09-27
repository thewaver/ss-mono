import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectGroupContentProps } from "./SelectGroupContent.types";

const CHECKED_MARK = "✓";
const MIXED_MARK = "–";

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
