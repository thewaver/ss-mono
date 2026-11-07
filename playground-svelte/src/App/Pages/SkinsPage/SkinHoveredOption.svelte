<script lang="ts">
    import {
        SKIN_SAMPLE_HOVERED_FLAGS,
        SKIN_SAMPLE_HOVERED_OPTION,
    } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";

    import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.svelte";
    import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import type { SkinListboxSampleProps } from "./SkinsPage.types";

    let props: SkinListboxSampleProps = $props();
</script>

<div class={styles.skinHoveredOption}>
    {#if props.isGliding}
        <div class={styles.skinHoveredFloater}>
            <PageGlideFloater kind={"highlight"} visibilityTarget={1} transitionDurationMs={0} />
        </div>
    {/if}

    <PageSelectOptionContent
        hasHoverFloater={props.isGliding}
        hasSelectionFloater={props.isGliding}
        flags={SKIN_SAMPLE_HOVERED_FLAGS}>{SKIN_SAMPLE_HOVERED_OPTION}</PageSelectOptionContent
    >
</div>
