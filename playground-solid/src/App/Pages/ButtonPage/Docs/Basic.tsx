import { createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components-solid";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonDocsExampleProps } from "../ButtonPageSolid.types";

type Props = ButtonDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getClicks, setClicks] = createSignal(0);

    return (
        <Button
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isPressed={props.isPressed}
            renderContent={(getFlags) => (
                <PageButtonContent flags={getFlags}>{`Clicks: ${getClicks()}`}</PageButtonContent>
            )}
            onClick={() => {
                setClicks((clicks) => clicks + 1);
            }}
        />
    );
};
