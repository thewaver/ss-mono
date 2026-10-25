import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const MultipleDocsExample = () => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <FileInput
            files={filesSignal}
            isMultiple={true}
            ariaLabel={"Attachments"}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
        />
    );
};
