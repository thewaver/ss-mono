import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";
import { DISABLED_BUT_REACHABLE_ATTACHMENT_LABEL } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { FileInputTooltipDocsExampleProps } from "../FileInputPageSolid.types";

type Props = FileInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <FileInput
            files={filesSignal}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={DISABLED_BUT_REACHABLE_ATTACHMENT_LABEL}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                hoverShowDelayMs: 0,
                renderContent: (
                    getVisibilityTarget,
                    getTransitionDurationMs,
                    _getPlacement,
                    _getFlags,
                    getArrowAim,
                ) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        arrowAim={getArrowAim}
                    >
                        Focusable so this tooltip can be read, but the file dialog must not open.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
