import { useState } from "react";

import { FileInput } from "@thewaver/ss-components-react";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const ImagesDocsExample = () => {
    const filesState = useState<File[]>([]);

    return (
        <FileInput
            files={filesState}
            accept={"image/*"}
            ariaLabel={"Avatar"}
            renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
        />
    );
};
