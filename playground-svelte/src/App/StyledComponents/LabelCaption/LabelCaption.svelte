<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

    import type { PageLabelCaptionProps } from "./LabelCaption.types";

    let props: PageLabelCaptionProps & { children?: Snippet } = $props();
</script>

<div class={styles.labelCaption} id={props.id}>
    {@render props.children?.()}
</div>
