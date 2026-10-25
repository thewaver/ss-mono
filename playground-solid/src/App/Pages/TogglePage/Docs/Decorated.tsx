import { createSignal } from "solid-js";

import { CornerHighlight, Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

export const DecoratedDocsExample = () => {
    const checkedSignal = createSignal(true);

    return (
        <Toggle
            checked={checkedSignal}
            ariaLabel={"Decorated toggle"}
            isPressed={checkedSignal[0]}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
            renderDecoration={(getFlags) => (
                <CornerHighlight
                    color={() => (getFlags().isPressed ? "yellow" : "transparent")}
                    cornerLength={CORNER_LENGTH}
                    strokeThickness={STROKE_THICKNESS}
                />
            )}
        />
    );
};
