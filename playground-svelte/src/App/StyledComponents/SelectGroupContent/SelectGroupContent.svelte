<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SelectGroupContentProps } from "./SelectGroupContentSvelte.types";
    import {
        CHECKED_MARK,
        MIXED_MARK,
    } from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.const";

    let props: SelectGroupContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());

    const flags = $derived(props.flags);
</script>

<div
    class={[styles.selectGroupContent, layerClass]}
    data-checked-state={flags === undefined ? undefined : String(flags.checkedState)}
    aria-hidden="true"
>
    {#if flags}
        <div
            class={[
                styles.selectGroupMark,
                flags.checkedState === true && styles.isChecked,
                flags.checkedState === "mixed" && styles.isMixed,
            ]}
        >
            <div class={styles.selectGroupMarkBox}>
                <div class={styles.selectGroupMarkTick}>
                    {flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            </div>
        </div>
    {/if}

    {@render props.children?.()}
</div>
