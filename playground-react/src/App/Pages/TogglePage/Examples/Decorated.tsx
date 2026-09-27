import { Corners, Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = ToggleExampleProps;

export const DecoratedExample = (props: Props) => (
    <Toggle
        checkedState={props.checkedState}
        ariaLabel={"Decorated toggle"}
        isPressed={props.checkedState[0]}
        renderContent={(flags) => <PageToggleContent flags={flags} />}
        renderDecoration={(flags) => (
            <Corners
                color={flags.isPressed ? "yellow" : "transparent"}
                cornerLength={CORNER_LENGTH}
                strokeThickness={STROKE_THICKNESS}
            />
        )}
    />
);
