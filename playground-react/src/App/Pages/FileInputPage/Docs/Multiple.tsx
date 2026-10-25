import { useState } from "react";

import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const MultipleDocsExample = () => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            files={filesState}
            isMultiple={true}
            ariaLabel={"Attachments"}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
        />
    );
};
