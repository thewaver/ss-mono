<script lang="ts">
    import { RichText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

    type Props = {
        content: string;
        removeOtherTags: boolean;
        maxDepth: number;
    };

    let props: Props = $props();
</script>

<div id={"customInputPreview"} class={styles.previewText}>
    <RichText content={props.content} removeOtherTags={props.removeOtherTags} maxDepth={props.maxDepth} />
</div>
