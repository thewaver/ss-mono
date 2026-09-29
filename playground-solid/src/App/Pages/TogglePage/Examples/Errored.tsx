import { Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleExampleProps } from "../TogglePage.types";

type Props = ToggleExampleProps;

export const ErroredExample = (props: Props) => (
    <Toggle
        checked={props.checked}
        ariaLabel={"Errored toggle"}
        hasError={() => !props.checked[0]()}
        renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
    />
);
