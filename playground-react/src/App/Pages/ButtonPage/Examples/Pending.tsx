import { Button } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonExampleProps } from "../ButtonPage.types";

const SAVE_DURATION_MS = 1000;

type Props = ButtonExampleProps;

export const PendingExample = (props: Props) => (
    <Button
        renderContent={(flags) => (
            <PageButtonContent flags={flags}>{flags.isPending ? "Saving…" : "Save"}</PageButtonContent>
        )}
        onClick={() =>
            new Promise<void>((resolve) => {
                setTimeout(() => {
                    props.onClick();
                    resolve();
                }, SAVE_DURATION_MS);
            })
        }
    />
);
