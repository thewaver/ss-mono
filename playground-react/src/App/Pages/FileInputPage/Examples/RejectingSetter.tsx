import { FileInput } from "@thewaver/ss-components-react";
import { MAX_ATTACHMENT_BYTES } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputRejectingExampleProps } from "../FileInputPage.types";

type Props = FileInputRejectingExampleProps;

export const RejectingSetterExample = (props: Props) => {
    return (
        <FileInput
            filesState={props.filesState}
            hasError={props.rejection !== ""}
            ariaLabel={"Small attachment"}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
            onChange={(files) => {
                const tooBig = files.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

                props.onRejectionChange(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

                if (tooBig.length) props.filesState[1]([]);
            }}
        />
    );
};
