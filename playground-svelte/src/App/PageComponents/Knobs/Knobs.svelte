<script lang="ts">
    import PageCheckField from "../Field/PageCheckField.svelte";
    import PageNumberField from "../Field/PageNumberField.svelte";
    import PageProp from "../Prop/Prop.svelte";
    import type { Knob, PageKnobsProps } from "./Knobs.types";

    const toEntries = (knobs: Record<string, Knob | undefined>) =>
        Object.entries(knobs).filter((entry): entry is [string, Knob] => entry[1] !== undefined);

    let props: PageKnobsProps = $props();

    const getValue = (key: string) => props.values[key] ?? props.defaults[key];
</script>

{#each toEntries(props.knobs) as [key, knob] (key)}
    <PageProp itemKey={key} label={knob.label} hint={knob.hint} defaultValue={props.defaults[key]}>
        {#if knob.kind === "number"}
            <PageNumberField
                value={Number(getValue(key))}
                min={knob.min}
                max={knob.max}
                step={knob.step}
                width={props.width}
                ariaLabel={knob.label}
                onInput={(value) => props.onInput(key, value)}
            />
        {:else}
            <PageCheckField
                value={Boolean(getValue(key))}
                ariaLabel={knob.label}
                onChange={(value) => props.onInput(key, value)}
            />
        {/if}
    </PageProp>
{/each}
