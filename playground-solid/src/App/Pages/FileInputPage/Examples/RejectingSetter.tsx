import { FileInput, access } from "@thewaver/ss-components-solid";
import { MAX_ATTACHMENT_BYTES } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageFileInputContent } from "../../../StyledComponents/FileInputContent/FileInputContent";
import type { FileInputRejectingExampleProps } from "../FileInputPage.types";

type Props = FileInputRejectingExampleProps;

export const RejectingSetterExample = (props: Props) => {
    return (
        <FileInput
            files={props.files}
            hasError={() => access(props.rejection) !== ""}
            ariaLabel={"Small attachment"}
            renderContent={(getRenderProps) => <PageFileInputContent renderProps={getRenderProps} />}
            onChange={(files) => {
                const tooBig = files.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

                props.onRejectionChange(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

                if (tooBig.length) props.files[1]([]);
            }}
        />
    );
};
