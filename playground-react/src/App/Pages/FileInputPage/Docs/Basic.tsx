import { useState } from "react";

import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputBasicDocsExampleProps } from "../FileInputPageReact.types";

type Props = FileInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            files={filesState}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Attachment"}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
        />
    );
};
