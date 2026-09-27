import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

export const DisabledExample = (props: Props) => (
    <Toggle
        checkedState={props.checkedState}
        ariaLabel={"Disabled toggle"}
        isDisabled={true}
        renderContent={(flags) => <PageToggleContent flags={flags} />}
    />
);
