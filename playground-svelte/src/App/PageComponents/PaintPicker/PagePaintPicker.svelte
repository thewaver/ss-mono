<script lang="ts">
    import PageGroupedSelectField from "../Field/PageGroupedSelectField.svelte";
    import PageSelectField from "../Field/PageSelectField.svelte";
    import PageKnobs from "../Knobs/Knobs.svelte";
    import PageProp from "../Prop/Prop.svelte";
    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import {
        PAINT_KINDS,
        PAINT_KIND_LABELS,
        SAMPLE_GROUPS,
        getPaintDefaults,
        getPaintKnobs,
    } from "./PaintPicker.const";
    import type { PagePaintPickerProps } from "./PaintPicker.types";

    let props: PagePaintPickerProps = $props();

    const paint = $derived(props.paintSlot.paint);
    const sampleKind = $derived(paint.kind === "none" ? undefined : paint.kind);
</script>

<PagePropsPanel scope={"sample"}>
    <PageProp itemKey={`${props.name}Kind`} label={props.label} hint={props.hint}>
        <PageSelectField
            value={paint.kind}
            values={PAINT_KINDS}
            computeLabel={(kind) => PAINT_KIND_LABELS[kind]}
            ariaLabel={props.label}
            onChange={props.paintSlot.setKind}
        />
    </PageProp>

    {#if sampleKind}
        {#key sampleKind}
            <PageProp
                itemKey={`${props.name}Key`}
                label={PAINT_KIND_LABELS[sampleKind]}
                hint={"Which sample paints it. Choosing one brings its own knobs with it."}
            >
                <PageGroupedSelectField
                    value={paint.key}
                    groups={SAMPLE_GROUPS[sampleKind]}
                    ariaLabel={`${props.label} ${PAINT_KIND_LABELS[sampleKind].toLowerCase()}`}
                    onChange={props.paintSlot.setKey}
                />
            </PageProp>
        {/key}
    {/if}

    <PageKnobs
        knobs={getPaintKnobs(paint.kind, paint.key)}
        defaults={getPaintDefaults(paint.kind, paint.key)}
        values={paint.configDefs}
        onInput={props.paintSlot.setConfigDef}
    />
</PagePropsPanel>
