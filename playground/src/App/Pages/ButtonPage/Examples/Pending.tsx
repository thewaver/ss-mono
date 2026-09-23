import { Button } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonExampleProps } from "../ButtonPage.types";

const SAVE_DURATION_MS = 1000;

type Props = ButtonExampleProps;

export const PendingExample = (props: Props) => (
    <Button
        renderContent={(getFlags) => (
            <PageButtonContent flags={getFlags}>{getFlags().isPending ? "Saving…" : "Save"}</PageButtonContent>
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
