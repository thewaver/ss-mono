<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableOfContentsContent/TableOfContentsContent.css";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

    import type { TableOfContentsContentProps } from "./TableOfContentsContent.types";

    let props: TableOfContentsContentProps & { children?: Snippet } = $props();
</script>

<span
    class={[
        styles.tableOfContentsContent,
        props.flags.isCurrent && styles.isCurrent,
        props.flags.isHovered && styles.isHovered,
    ]}
    style:margin-inline-start={`calc(${themeVars.spacing.double} * ${props.depth})`}
>
    {@render props.children?.()}
</span>
