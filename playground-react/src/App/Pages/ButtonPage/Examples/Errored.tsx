import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonErroredExampleProps } from "../ButtonPage.types";

type Props = ButtonErroredExampleProps;

export const ErroredExample = (props: Props) => {
    return (
        <Button
            hasError={props.hasError}
            renderContent={(flags) => <PageButtonContent flags={flags}>Toggle Error</PageButtonContent>}
            onClick={props.onClick}
        />
    );
};
