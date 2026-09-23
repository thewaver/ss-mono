import { createMemo, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { access } from "../../../Utils/propUtils";
import { LABEL_DEFAULTS } from "./Label.const";
import { LabelContextProvider, useLabelContext } from "./Label.context";
import type { LabelContextType } from "./Label.context.types";
import type { LabelProps } from "./Label.types";

import * as styles from "./Label.css";

export const Label = (props: LabelProps) => {
    const context = useLabelContext();

    const labelId = createUniqueId();

    const innerContext: LabelContextType = {
        getIsLabelled: () => true,
        getLabelId: () => (context.getIsLabelled() ? context.getLabelId() : labelId),
    };

    const getOrientation = createMemo(() => access(props.orientation) ?? LABEL_DEFAULTS.orientation);

    return (
        <Dynamic
            component={context.getIsLabelled() ? "div" : "label"}
            id={context.getIsLabelled() ? undefined : labelId}
            class={styles.labelRoot}
            style={{
                "flex-direction": getOrientation() === "horizontal" ? "row" : "column",
                "gap": `${access(props.gap) ?? LABEL_DEFAULTS.gap}px`,
            }}
        >
            <LabelContextProvider value={innerContext}>{props.children}</LabelContextProvider>
        </Dynamic>
    );
};
