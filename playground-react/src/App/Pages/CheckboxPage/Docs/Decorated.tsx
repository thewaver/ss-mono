import { useState } from "react";

import { Checkbox, CornerHighlight } from "@thewaver/ss-components-react";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

export const DecoratedDocsExample = () => {
    const checkedState = useState(true);

    return (
        <Checkbox
            checked={checkedState}
            ariaLabel={"Decorated checkbox"}
            isPressed={checkedState[0]}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>Decorated checkbox</PageCheckboxContent>}
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
