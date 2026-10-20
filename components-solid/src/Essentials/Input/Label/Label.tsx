import { createMemo, createSignal, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { LABEL_DEFAULTS, type LabelContextType, LabelStyles as styles } from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { LabelContextProvider, useLabelContext } from "./Label.context";
import type { LabelProps } from "./LabelSolid.types";

export const Label = (props: LabelProps) => {
    const context = useLabelContext();

    const labelId = createUniqueId();

    const [getRegisteredControlId, setRegisteredControlId] = createSignal<string>();

    const innerContext: LabelContextType = {
        getIsLabeled: () => true,
        getLabelId: () => (context.getIsLabeled() ? context.getLabelId() : labelId),
        setControlId: (id) => (context.getIsLabeled() ? context.setControlId(id) : setRegisteredControlId(id)),
    };

    const getOrientation = createMemo(() => access(props.orientation) ?? LABEL_DEFAULTS.orientation);

    return (
        <Dynamic
            component={context.getIsLabeled() ? "div" : "label"}
            id={context.getIsLabeled() ? undefined : labelId}
            for={context.getIsLabeled() ? undefined : (access(props.for) ?? getRegisteredControlId())}
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
