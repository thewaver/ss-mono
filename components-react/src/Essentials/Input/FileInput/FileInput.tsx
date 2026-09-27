import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    FILE_INPUT_DEFAULTS,
    type FileInputRenderProps,
    FileInputStyles,
    FileInputUtils,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import { FormFieldReactUtils } from "../FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import type { FileInputElementProps, FileInputProps } from "./FileInput.types";

const FileInputElement = (props: FileInputElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const elementRef = useRef<HTMLInputElement | null>(null);
    const element = useElement(elementRef);
    const latestRef = useLatest(props.ref);

    FormFieldReactUtils.useRegisterControl(elementRef);

    const [changeCount, setChangeCount] = useState(0);

    const isDisabled = props.flags.isDisabled ?? false;

    useLayoutEffect(() => {
        if (!element) return;

        FileInputUtils.syncElement(element, props.files);
    }, [element, props.files, changeCount]);

    const setRef = useCallback(
        (next: HTMLInputElement | null) => {
            elementRef.current = next;
            latestRef.current?.(next);
        },
        [latestRef],
    );

    return (
        <>
            {props.renderContent(props.flags)}

            <input
                id={props.id}
                ref={setRef}
                type="file"
                name={props.name}
                className={FileInputStyles.fileInputElement}
                accept={props.accept}
                multiple={props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-disabled={isDisabled || undefined}
                aria-invalid={props.flags.hasError || undefined}
                onClick={(e) => {
                    if (isDisabled) e.preventDefault();
                }}
                onChange={(e) => {
                    if (isDisabled) return;

                    props.onChange?.(Array.from(e.currentTarget.files ?? []));

                    setChangeCount((count) => count + 1);
                }}
                onMouseEnter={(e) => {
                    if (isDisabled) return;

                    props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (isDisabled) return;

                    props.onMouseLeave?.(e);
                }}
            />
        </>
    );
};

export const FileInput = (props: FileInputProps) => {
    const [files, setFiles] = props.filesState;

    const controlRef = useRef<HTMLElement | null>(null);
    const control = useElement(controlRef);

    const isDisabled = props.isDisabled ?? false;

    const receive = (arrived: File[]) => {
        const admission = FileInputUtils.admitFiles(arrived, {
            accept: props.accept,
            isMultiple: props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple,
            maxFiles: props.maxFiles,
            maxSizeBytes: props.maxSizeBytes,
        });

        if (FileInputUtils.getIsValueWritten(admission)) {
            setFiles(admission.accepted);

            props.onChange?.(admission.accepted);
        }

        if (admission.rejections.length) props.onReject?.(admission.rejections);
    };

    const latest = useLatest({ isDisabled, receive });

    const [tracker] = useState(() =>
        FileInputUtils.createDropTracker({
            getIsDisabled: () => latest.current.isDisabled,
            onDrop: (dropped) => latest.current.receive(dropped),
        }),
    );

    useEffect(() => {
        const dropArea = control?.parentElement;

        if (!dropArea) return;

        return tracker.observe(dropArea);
    }, [control, tracker]);

    const isDragOver = useStore(tracker) && !isDisabled;

    const extraFlags: FileInputRenderProps = { files, isDragOver };

    return (
        <InteractionWrapper<FileInputRenderProps>
            {...props}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <FileInputElement
                    ref={(element) => {
                        setElementRef(element);
                        controlRef.current = element;
                    }}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    accept={props.accept}
                    isMultiple={props.isMultiple}
                    flags={flags}
                    files={files}
                    renderContent={props.renderContent}
                    onChange={receive}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
