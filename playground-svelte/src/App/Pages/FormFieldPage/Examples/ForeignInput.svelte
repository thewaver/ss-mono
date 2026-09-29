<script lang="ts">
    import { FormFieldSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

    let { value = $bindable() }: { value: string } = $props();

    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();
</script>

<input class={styles.foreignInput} bind:value aria-describedby={getAriaDescribedBy()} />
