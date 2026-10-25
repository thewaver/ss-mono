import { useId, useState } from "react";

import { LABEL_DEFAULTS, type LabelContextType, LabelStyles } from "@thewaver/ss-components";

import { LabelContextProvider, useLabelContext } from "./Label.context";
import type { LabelProps } from "./Label.types";

export const Label = (props: LabelProps) => {
    const context = useLabelContext();
    const labelId = useId();
    const isNested = context.getIsLabeled();
    const [registeredControlId, setRegisteredControlId] = useState<string>();
    const [registeredCaptionId, setRegisteredCaptionId] = useState<string>();

    const innerContext: LabelContextType = {
        getIsLabeled: () => true,
        getLabelId: () => (isNested ? context.getLabelId() : labelId),
        setControlId: isNested ? context.setControlId : setRegisteredControlId,
        getCaptionId: () => (isNested ? context.getCaptionId() : registeredCaptionId),
        setCaptionId: isNested ? context.setCaptionId : setRegisteredCaptionId,
    };

    const Element = isNested ? "div" : "label";
    const orientation = props.orientation ?? LABEL_DEFAULTS.orientation;

    return (
        <Element
            id={isNested ? undefined : labelId}
            htmlFor={isNested ? undefined : (props.for ?? registeredControlId)}
            className={LabelStyles.labelRoot}
            style={{
                flexDirection: orientation === "horizontal" ? "row" : "column",
                gap: `${props.gap ?? LABEL_DEFAULTS.gap}px`,
            }}
        >
            <LabelContextProvider value={innerContext}>{props.children}</LabelContextProvider>
        </Element>
    );
};
