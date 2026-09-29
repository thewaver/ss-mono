import { Checkbox, Corners } from "@thewaver/ss-components-react";

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
        renderContent={(flags) => <PageCheckboxContent flags={flags} />}
        renderDecoration={(flags) => (
            <Corners
                color={flags.isPressed ? "yellow" : "transparent"}
                cornerLength={CORNER_LENGTH}
                strokeThickness={STROKE_THICKNESS}
            />
        )}
    />
);
