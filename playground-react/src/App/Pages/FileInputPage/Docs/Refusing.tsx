import { useState } from "react";

import { FileInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const RefusingDocsExample = () => {
    const filesState = useState<File[]>([]);

    const [rejection, setRejection] = useState("");

    return (
        <>
            <FileInput
                files={filesState}
                hasError={rejection !== ""}
                ariaLabel={"Attachment"}
                renderContent={(renderProps) => <PageFileInputContent renderProps={renderProps} />}
                onChange={(files) => {
                    const spaced = files.find((file) => file.name.includes(" "));

                    setRejection(spaced ? `"${spaced.name}" has a space in its name, rename it and pick again` : "");

                    if (spaced) filesState[1]([]);
                }}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {rejection || "A file whose name has a space in it is refused"}
            </div>
        </>
    );
};
