<script lang="ts">
    import { Markup } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

    import type { PageFilterStageProps } from "./SVGFiltersContent.types";

    let props: PageFilterStageProps = $props();

    const defsElement = $derived(props.renderDefs());
</script>

<div class={styles.filterStageRoot}>
    <svg class={styles.filterStageDefs} aria-hidden="true">
        <defs><Markup markup={defsElement} /></defs>
    </svg>

    <div
        class={styles.filterStageSubject}
        style:filter={defsElement ? `url(#${props.filterId})` : undefined}
        data-subject={props.filterId}
    >
        <span class={styles.filterStageWord}>{props.label}</span>
    </div>
</div>
