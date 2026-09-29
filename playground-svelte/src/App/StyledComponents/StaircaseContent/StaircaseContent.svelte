<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/StaircaseContent/StaircaseContent.css";

    import type { PageStaircaseStepProps } from "./StaircaseContent.types";

    let props: PageStaircaseStepProps & { children?: Snippet } = $props();
</script>

<div class={styles.staircaseStep}>
    <div>{@render props.children?.()}</div>

    <div class={styles.staircaseStepIndent}>{`${Math.round(props.state.stepIndent)}px`}</div>
</div>
