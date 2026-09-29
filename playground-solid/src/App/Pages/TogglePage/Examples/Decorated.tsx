import { Corners, Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = ToggleExampleProps;

export const DecoratedExample = (props: Props) => (
    <Toggle
        checked={props.checked}
        ariaLabel={"Decorated toggle"}
        isPressed={props.checked[0]}
        renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
        renderDecoration={(getFlags) => (
            <Corners
                color={() => (getFlags().isPressed ? "yellow" : "transparent")}
                cornerLength={() => CORNER_LENGTH}
                strokeThickness={() => STROKE_THICKNESS}
            />
        )}
    />
);
