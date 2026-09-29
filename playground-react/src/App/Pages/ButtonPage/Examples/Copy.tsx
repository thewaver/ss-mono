import { useEffect, useRef, useState } from "react";

import { Button, LiveAnnouncerUtils } from "@thewaver/ss-components-react";

import { PageControlRow } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonCopyExampleProps } from "../ButtonPage.types";

const COPIED_MS = 2000;
const COPIED_ANNOUNCEMENT = "Copied to the clipboard";
const FAILED_ANNOUNCEMENT = "Could not copy to the clipboard";

type Props = ButtonCopyExampleProps;

export const CopyExample = (props: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");

        return () => clearTimeout(copiedTimerRef.current);
    }, []);

    return (
        <PageControlRow>
            <code>{props.text}</code>

            <Button
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>
                        {flags.isPending ? "Copying…" : isCopied ? "Copied" : "Copy"}
                    </PageButtonContent>
                )}
                onClick={() =>
                    navigator.clipboard.writeText(props.text).then(
                        () => {
                            clearTimeout(copiedTimerRef.current);
                            setIsCopied(true);
                            LiveAnnouncerUtils.announce(COPIED_ANNOUNCEMENT);
                            props.onCopy();

                            copiedTimerRef.current = setTimeout(() => setIsCopied(false), COPIED_MS);
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
