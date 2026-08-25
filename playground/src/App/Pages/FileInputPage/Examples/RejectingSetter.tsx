import { FileInput, access } from "@thewaver/ss-components";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import { MAX_ATTACHMENT_BYTES } from "../FileInputPage.const";
import type { FileInputRejectingExampleProps } from "../FileInputPage.types";

type Props = FileInputRejectingExampleProps;

export const RejectingSetterExample = (props: Props) => {
    return (
        <FileInput
            filesSignal={props.filesSignal}
            hasError={() => access(props.rejection) !== ""}
            ariaLabel={"Small attachment"}
            renderContent={(getFlags) => <PageFileInputContent flags={getFlags} />}
            onChange={(files) => {
                const tooBig = files.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

                props.onRejectionChange(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

                if (tooBig.length) props.filesSignal[1]([]);
            }}
        />
    );
};
