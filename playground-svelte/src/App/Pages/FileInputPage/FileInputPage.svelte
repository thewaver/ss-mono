<script lang="ts">
    import type { FileInputRejection } from "@thewaver/ss-components-svelte";
    import {
        DROP_ZONE_REASON_TEXT,
        MAX_ATTACHMENT_BYTES,
    } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import DropZoneExample from "./Examples/DropZone.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import ImagesExample from "./Examples/Images.svelte";
    import LabeledExample from "./Examples/Labeled.svelte";
    import MultipleExample from "./Examples/Multiple.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import RejectingSetterExample from "./Examples/RejectingSetter.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/FileInputPage/Examples";

    const describe = (files: File[]) => (files.length ? files.map((file) => file.name).join(", ") : "none");

    const describeRejections = (rejections: FileInputRejection[]) =>
        rejections.length
            ? rejections
                  .map((rejection) => `${rejection.file.name}: ${DROP_ZONE_REASON_TEXT[rejection.reason]}`)
                  .join(", ")
            : "none";

    let defaultFiles = $state.raw<File[]>([]);
    let multipleFiles = $state.raw<File[]>([]);
    let imagesFiles = $state.raw<File[]>([]);
    let rejectingFiles = $state.raw<File[]>([]);
    let disabledFiles = $state.raw<File[]>([]);
    let reachableFiles = $state.raw<File[]>([]);
    let erroredFiles = $state.raw<File[]>([]);
    let labeledFiles = $state.raw<File[]>([]);
    let dropZoneFiles = $state.raw<File[]>([]);

    let rejection = $state("");
    let dropZoneRejections = $state.raw<FileInputRejection[]>([]);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `files: ${describe(defaultFiles)}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "multiple",
            name: "Multiple",
            readout: () => `files: ${describe(multipleFiles)}`,
            component: multipleExample,
            path: `${EXAMPLES_ROOT}/Multiple.svelte`,
        },
        {
            key: "images",
            name: "Accepting images only",
            readout: () => `files: ${describe(imagesFiles)} — accept is a filter, never a guarantee`,
            component: imagesExample,
            path: `${EXAMPLES_ROOT}/Images.svelte`,
        },
        {
            key: "rejectingSetter",
            name: "Rejecting setter",
            readout: () =>
                `files: ${describe(rejectingFiles)}${rejection ? ` — ${rejection}` : ` — anything over ${MAX_ATTACHMENT_BYTES} bytes is refused`}`,
            component: rejectingSetterExample,
            path: `${EXAMPLES_ROOT}/RejectingSetter.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `files: ${describe(disabledFiles)}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `files: ${describe(reachableFiles)}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `files: ${describe(erroredFiles)} — required, nothing picked yet`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `files: ${describe(labeledFiles)} — the caption opens the dialog`,
            component: labeledExample,
            path: `${EXAMPLES_ROOT}/Labeled.svelte`,
        },
        {
            key: "dropZone",
            name: "Drop area with limits",
            readout: () => `files: ${describe(dropZoneFiles)} — refused: ${describeRejections(dropZoneRejections)}`,
            component: dropZoneExample,
            path: `${EXAMPLES_ROOT}/DropZone.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:files={defaultFiles} />
{/snippet}

{#snippet multipleExample()}
    <MultipleExample bind:files={multipleFiles} />
{/snippet}

{#snippet imagesExample()}
    <ImagesExample bind:files={imagesFiles} />
{/snippet}

{#snippet rejectingSetterExample()}
    <RejectingSetterExample
        bind:files={rejectingFiles}
        {rejection}
        onRejectionChange={(next) => {
            rejection = next;
        }}
    />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:files={disabledFiles} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:files={reachableFiles} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:files={erroredFiles} />
{/snippet}

{#snippet labeledExample()}
    <LabeledExample bind:files={labeledFiles} />
{/snippet}

{#snippet dropZoneExample()}
    <DropZoneExample
        bind:files={dropZoneFiles}
        onRejectionsChange={(rejections) => {
            dropZoneRejections = rejections;
        }}
    />
{/snippet}

<PageExamples items={examples} />
