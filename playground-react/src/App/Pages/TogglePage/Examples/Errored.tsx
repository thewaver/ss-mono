import { Toggle } from "@thewaver/ss-components-react";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

export const ErroredExample = (props: Props) => (
    <Toggle
        checkedState={props.checkedState}
        ariaLabel={"Errored toggle"}
        hasError={!props.checkedState[0]}
        renderContent={(flags) => <PageToggleContent flags={flags} />}
    />
);
