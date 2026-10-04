<script lang="ts">
    import { untrack } from "svelte";

    import { MORPH_TEXT_DEFAULTS, MorphTextUtils, MorphTextStyles as styles } from "@thewaver/ss-components";

    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { MorphTextProps } from "./MorphText.types.js";

    let props: MorphTextProps = $props();

    const filterId = $props.id();

    const morpher = MorphTextUtils.createMorpher(
        untrack(() => props.text),
        {
            getMorphDurationMs: () => props.morphDurationMs ?? MORPH_TEXT_DEFAULTS.morphDurationMs,
            onMorphEnd: (text) => props.onMorphEnd?.(text),
        },
    );

    $effect(() => () => morpher.stop());

    watchChange(
        () => props.text,
        (text) => morpher.morphTo(text),
    );

    const getState = readStore(morpher);

    const frame = $derived(
        MorphTextUtils.computeFrame(getState().progress, props.maxBlurPx ?? MORPH_TEXT_DEFAULTS.maxBlurPx),
    );
    const isMorphing = $derived(getState().previous !== undefined);
</script>

{#snippet copy(text: string)}
    {#if props.renderText}
        {@render props.renderText(text)}
    {:else}
        {text}
    {/if}
{/snippet}

<span class={styles.morphTextRoot} style:filter={isMorphing ? `url(#${filterId})` : undefined}>
    <svg class={styles.morphTextFilterHost} aria-hidden="true">
        <defs>
            <filter id={filterId}>
                <feColorMatrix in="SourceGraphic" type="matrix" values={MorphTextUtils.THRESHOLD_MATRIX} />
            </filter>
        </defs>
    </svg>

    {#if getState().previous !== undefined}
        {#key getState().previous}
            <span
                class={styles.morphTextCopy}
                style={toStyle(MorphTextUtils.toCopyStyle(frame.outgoing))}
                aria-hidden="true"
            >
                {@render copy(getState().previous!)}
            </span>
        {/key}
    {/if}

    <span
        class={styles.morphTextCopy}
        style={isMorphing ? toStyle(MorphTextUtils.toCopyStyle(frame.incoming)) : undefined}
    >
        {@render copy(getState().current)}
    </span>
</span>
