import { createRenderEffect, createSignal } from "solid-js";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { FormFieldUtils } from "../FormField/FormField.utils";
import { LabelUtils } from "../Label/Label.utils";
import { FILE_INPUT_DEFAULTS } from "./FileInput.const";
import type { FileInputElementProps, FileInputProps, FileInputRenderProps } from "./FileInput.types";
import { FileInputUtils } from "./FileInput.utils";

import * as styles from "./FileInput.css";

const EMPTY_FILE_INPUT_VALUE = "";

const holdsFiles = (element: HTMLInputElement, files: File[]) => {
    const held = element.files ?? [];

    return held.length === files.length && files.every((file, index) => held[index] === file);
};

const FileInputElement = (props: FileInputElementProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<HTMLInputElement>();

    FormFieldUtils.registerControl(getElementRef);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const syncElement = (element: HTMLInputElement) => {
        const files = access(props.files);

        if (holdsFiles(element, files)) return;

        if (!files.length) {
            element.value = EMPTY_FILE_INPUT_VALUE;
            return;
        }

        const transfer = new DataTransfer();

        for (const file of files) transfer.items.add(file);

        element.files = transfer.files;
    };

    createRenderEffect(() => {
        const element = getElementRef();

        if (!element) return;

        syncElement(element);
    });

    return (
        <>
            {props.renderContent(() => access(props.flags))}

            <input
                id={access(props.id)}
                ref={(element) => {
                    setElementRef(element);
                    props.ref?.(element);
                }}
                type="file"
                name={access(props.name)}
                class={styles.fileInputElement}
                accept={access(props.accept)}
                multiple={access(props.isMultiple) ?? FILE_INPUT_DEFAULTS.isMultiple}
                aria-label={getAriaLabel()}
                aria-describedby={getAriaDescribedBy()}
                aria-disabled={getIsDisabled() || undefined}
                aria-invalid={access(props.flags).hasError || undefined}
                onClick={(e) => {
                    if (getIsDisabled()) e.preventDefault();
                }}
                onChange={(e) => {
                    const element = e.currentTarget;

                    if (getIsDisabled()) return;

                    void props.onChange?.(Array.from(element.files ?? []));

                    syncElement(element);
                }}
                onMouseEnter={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (getIsDisabled()) return;

                    void props.onMouseLeave?.(e);
                }}
            />
        </>
    );
};

export const FileInput = (props: FileInputProps) => {
    const [getControlRef, setControlRef] = createSignal<HTMLElement>();

    const getIsDisabled = () => access(props.isDisabled) ?? false;

    const receive = (files: File[]) => {
        const { accepted, rejections } = FileInputUtils.admitFiles(files, {
            accept: access(props.accept),
            isMultiple: access(props.isMultiple) ?? FILE_INPUT_DEFAULTS.isMultiple,
            maxFiles: access(props.maxFiles),
            maxSizeBytes: access(props.maxSizeBytes),
        });

        if (accepted.length || !rejections.length) {
            props.filesSignal[1](accepted);

            void props.onChange?.(accepted);
        }

        if (rejections.length) void props.onReject?.(rejections);
    };

    const { getIsDragOver } = FileInputUtils.trackDrop(
        () => getControlRef()?.parentElement ?? undefined,
        getIsDisabled,
        receive,
    );

    return (
        <InteractionWrapper
            {...props}
            extraFlags={(): FileInputRenderProps => ({
                files: props.filesSignal[0](),
                isDragOver: getIsDragOver(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <FileInputElement
                    ref={(element) => {
                        setElementRef(element);
                        setControlRef(element);
                    }}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    accept={props.accept}
                    isMultiple={props.isMultiple}
                    flags={getRenderProps}
                    files={() => props.filesSignal[0]()}
                    renderContent={props.renderContent}
                    onChange={receive}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
