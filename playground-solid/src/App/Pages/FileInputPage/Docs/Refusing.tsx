import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const RefusingDocsExample = () => {
    const filesSignal = createSignal<File[]>([]);

    const [getRejection, setRejection] = createSignal("");

    return (
        <>
            <FileInput
                files={filesSignal}
                hasError={() => getRejection() !== ""}
                ariaLabel={"Attachment"}
                renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
                onChange={(files) => {
                    const spaced = files.find((file) => file.name.includes(" "));

                    setRejection(spaced ? `"${spaced.name}" has a space in its name, rename it and pick again` : "");

                    if (spaced) filesSignal[1]([]);
                }}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {getRejection() || "A file whose name has a space in it is refused"}
            </div>
        </>
    );
};
