import { createSignal } from "solid-js";

import { Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import type { ToggleBasicDocsExampleProps } from "../TogglePageSolid.types";

type Props = ToggleBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const checkedSignal = createSignal(false);

    return (
        <Toggle
            checked={checkedSignal}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Default toggle"}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
        />
    );
};
