import { createSignal } from "solid-js";

import { Checkbox, CornerHighlight } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

export const DecoratedDocsExample = () => {
    const checkedSignal = createSignal(true);

    return (
        <Checkbox
            checked={checkedSignal}
            ariaLabel={"Decorated checkbox"}
            isPressed={checkedSignal[0]}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
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
