import { createSignal, onCleanup, onMount } from "solid-js";

import { Button, LiveAnnouncerUtils } from "@thewaver/ss-components";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonCopyExampleProps } from "../ButtonPage.types";

const COPIED_MS = 2000;
const COPIED_ANNOUNCEMENT = "Copied to the clipboard";
const FAILED_ANNOUNCEMENT = "Could not copy to the clipboard";

type Props = ButtonCopyExampleProps;

export const CopyExample = (props: Props) => {
    const [getIsCopied, setIsCopied] = createSignal(false);

    let copiedTimer: ReturnType<typeof setTimeout> | undefined;

    onMount(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    });

    onCleanup(() => clearTimeout(copiedTimer));

    return (
        <PageControlRow>
            <code>{props.text}</code>

            <Button
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {getFlags().isPending ? "Copying…" : getIsCopied() ? "Copied" : "Copy"}
                    </PageButtonContent>
                )}
                onClick={() =>
                    navigator.clipboard.writeText(props.text).then(
                        () => {
                            clearTimeout(copiedTimer);
                            setIsCopied(true);
                            LiveAnnouncerUtils.announce(COPIED_ANNOUNCEMENT);
                            props.onCopy();

                            copiedTimer = setTimeout(() => setIsCopied(false), COPIED_MS);
                        },
                        () => {
                            LiveAnnouncerUtils.announce(FAILED_ANNOUNCEMENT, "assertive");
                        },
                    )
                }
            />
        </PageControlRow>
    );
};
