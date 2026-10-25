import { createSignal } from "solid-js";

import { FileInput } from "@thewaver/ss-components-solid";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";

export const ImagesDocsExample = () => {
    const filesSignal = createSignal<File[]>([]);

    return (
        <FileInput
            files={filesSignal}
            accept={"image/*"}
            ariaLabel={"Avatar"}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
        />
    );
};
