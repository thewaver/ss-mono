import { type SlotsType, defineComponent, shallowRef } from "vue";

import {
    FILE_INPUT_DEFAULTS,
    type FileInputRenderProps,
    FileInputStyles,
    FileInputUtils,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { FormFieldVueUtils } from "../FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import type { FileInputElementProps, FileInputProps, FileInputSlots } from "./FileInput.types";

const FileInputElement = defineComponent(
    (props: FileInputElementProps, { slots, expose }: SlotsContext<InteractionControlSlots<FileInputRenderProps>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const elementRef = shallowRef<HTMLInputElement>();
        const changeCount = shallowRef(0);

        exposeElement(expose, () => elementRef.value);

        FormFieldVueUtils.useRegisterControl(elementRef);

        watchAfterRender([elementRef, () => props.files, changeCount], ([element, files]) => {
            if (!element) return;

            FileInputUtils.syncElement(element, files);
        });

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <>
                    {callSlot(slots.renderContent, props.flags)}

                    <input
                        id={props.id}
                        ref={(target) => {
                            elementRef.value = toElement<HTMLInputElement>(target);
                        }}
                        type="file"
                        name={props.name}
                        class={FileInputStyles.fileInputElement}
                        accept={props.accept}
                        multiple={props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple}
                        aria-label={ariaLabel.value}
                        aria-describedby={ariaDescribedBy.value}
                        aria-disabled={isDisabled || undefined}
                        aria-invalid={props.flags.hasError || undefined}
                        onClick={(e) => {
                            if (isDisabled) e.preventDefault();
                        }}
                        onChange={(e) => {
                            if (isDisabled) return;

                            props.onChange?.(Array.from((e.currentTarget as HTMLInputElement).files ?? []));

                            changeCount.value += 1;
                        }}
                        onMouseenter={(e) => {
                            if (isDisabled) return;

                            props.onMouseEnter?.(e);
                        }}
                        onMouseleave={(e) => {
                            if (isDisabled) return;

                            props.onMouseLeave?.(e);
                        }}
                    />
                </>
            );
        };
    },
    {
        name: "FileInputElement",
        props: declareProps<FileInputElementProps>({
            onChange: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            name: null,
            accept: null,
            isMultiple: Boolean,
            files: null,
        }),
    },
);

export const FileInput = defineComponent(
    (props: FileInputProps, { slots, expose }: SlotsContext<FileInputSlots>) => {
        const files = useTwoWay(props, "files", []);

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const getIsDisabled = () => props.isDisabled ?? false;

        const receive = (arrived: File[]) => {
            const admission = FileInputUtils.admitFiles(arrived, {
                accept: props.accept,
                isMultiple: props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple,
                maxFiles: props.maxFiles,
                maxSizeBytes: props.maxSizeBytes,
            });

            if (FileInputUtils.getIsValueWritten(admission)) {
                files.value = admission.accepted;

                props.onChange?.(admission.accepted);
            }

            if (admission.rejections.length) props.onReject?.(admission.rejections);
        };

        const tracker = FileInputUtils.createDropTracker({ getIsDisabled, onDrop: (dropped) => receive(dropped) });

        const isTrackerDragOver = useStore(tracker);

        watchAfterRender([controlRef], ([control]) => {
            const dropArea = control?.parentElement;

            if (!dropArea) return;

            return tracker.observe(dropArea);
        });

        return () => {
            const extraFlags: FileInputRenderProps = {
                files: files.value,
                isDragOver: isTrackerDragOver.value && !getIsDisabled(),
            };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <FileInputElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    id={props.id}
                                    name={props.name}
                                    ariaLabel={props.ariaLabel}
                                    accept={props.accept}
                                    isMultiple={props.isMultiple}
                                    flags={flags}
                                    files={files.value}
                                    onChange={receive}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </FileInputElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<FileInputRenderProps>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "FileInput",
        slots: Object as SlotsType<FileInputSlots>,
        props: declareProps<FileInputProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "onChange": null,
            "onReject": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "accept": null,
            "isMultiple": Boolean,
            "maxFiles": null,
            "maxSizeBytes": null,
            "files": null,
            "onUpdate:files": null,
        }),
    },
);
