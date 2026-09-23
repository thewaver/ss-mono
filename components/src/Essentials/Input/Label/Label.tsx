import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import { access } from "../../../Utils/propUtils";
import { LABEL_DEFAULTS } from "./Label.const";
import { LABEL_CONTEXT, LabelContextProvider, useLabelContext } from "./Label.context";
import type { LabelProps } from "./Label.types";

import * as styles from "./Label.css";

export const Label = (props: LabelProps) => {
    const context = useLabelContext();

    const getDir = createMemo(() => access(props.dir) ?? LABEL_DEFAULTS.dir);

    return (
        <Dynamic
            component={context.getIsLabelled() ? "div" : "label"}
            class={styles.labelRoot}
            style={{
                "flex-direction": getDir(),
                "gap": `${access(props.gap) ?? LABEL_DEFAULTS.gap}px`,
            }}
        >
            <LabelContextProvider value={LABEL_CONTEXT}>{props.children}</LabelContextProvider>
        </Dynamic>
    );
};
