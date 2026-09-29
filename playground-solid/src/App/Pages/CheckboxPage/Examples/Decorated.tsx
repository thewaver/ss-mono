import { Checkbox, Corners } from "@thewaver/ss-components-solid";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import type { CheckboxExampleProps } from "../CheckboxPage.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = CheckboxExampleProps;

export const DecoratedExample = (props: Props) => (
    <Checkbox
        checked={props.checked}
        ariaLabel={"Decorated checkbox"}
        isPressed={props.checked[0]}
        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
        renderDecoration={(getFlags) => (
            <Corners
                color={() => (getFlags().isPressed ? "yellow" : "transparent")}
                cornerLength={() => CORNER_LENGTH}
                strokeThickness={() => STROKE_THICKNESS}
            />
        )}
    />
);
