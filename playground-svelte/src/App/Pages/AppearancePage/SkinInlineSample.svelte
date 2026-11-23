<script lang="ts">
    import {
        SKIN_SAMPLE_INLINE_FLAGS,
        SKIN_SAMPLE_INLINE_HOVERED_FLAGS,
    } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

    import PageInlineEditContent from "../../StyledComponents/InlineEditContent/InlineEditContent.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();
</script>

<PageInlineEditContent flags={props.isHovered ? SKIN_SAMPLE_INLINE_HOVERED_FLAGS : SKIN_SAMPLE_INLINE_FLAGS}>
    {props.state}
</PageInlineEditContent>
