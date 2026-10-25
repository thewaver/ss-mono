import { useState } from "react";

import { CornerHighlight, Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

export const DecoratedDocsExample = () => {
    const checkedState = useState(true);

    return (
        <Toggle
            checked={checkedState}
            ariaLabel={"Decorated toggle"}
            isPressed={checkedState[0]}
            renderContent={(flags) => <PageToggleContent flags={flags}>Decorated toggle</PageToggleContent>}
            renderDecoration={(flags) => (
                <CornerHighlight
                    color={flags.isPressed ? "yellow" : "transparent"}
                    cornerLength={CORNER_LENGTH}
                    strokeThickness={STROKE_THICKNESS}
                />
            )}
        />
    );
};
