import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonExampleProps } from "../ButtonPage.types";

type Props = ButtonExampleProps;

export const DefaultExample = (props: Props) => (
    <Button
        renderContent={(flags) => <PageButtonContent flags={flags}>Click Me</PageButtonContent>}
        onClick={props.onClick}
    />
);
