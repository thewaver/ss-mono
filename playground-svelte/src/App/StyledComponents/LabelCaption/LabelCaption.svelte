<script lang="ts">
    import type { Snippet } from "svelte";

    import { LabelSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

    import type { PageLabelCaptionProps } from "./LabelCaptionSvelte.types";

    let props: PageLabelCaptionProps & { children?: Snippet } = $props();

    const fallbackId = $props.id();

    const getId = LabelSvelteUtils.registerCaptionId(fallbackId, () => props.id);
</script>

<div class={styles.labelCaption} id={getId()}>
    {@render props.children?.()}
</div>
