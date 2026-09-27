import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

export const DefaultExample = (props: Props) => (
    <Toggle
        checkedState={props.checkedState}
        ariaLabel={"Default toggle"}
        renderContent={(flags) => <PageToggleContent flags={flags} />}
    />
);
