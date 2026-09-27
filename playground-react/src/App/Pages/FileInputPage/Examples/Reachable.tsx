import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

export const ReachableExample = (props: Props) => (
    <FileInput
        filesState={props.filesState}
        isDisabled={true}
        isReachableWhenDisabled={true}
        ariaLabel={"Disabled but reachable attachment"}
        renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            hoverShowDelayMs: 0,
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but the file dialog must not open.
                </PageTooltipContent>
            ),
        }}
    />
);
