<script lang="ts">
    import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

    import { getDocsViewContext } from "../DocsView/DocsView.context";
    import type { PageDocsSectionProps } from "./DocsSectionSvelte.types";

    let props: PageDocsSectionProps = $props();

    const docsView = getDocsViewContext();

    const attachHeading = (element: HTMLElement) => docsView?.register({ title: props.title, element });
</script>

<section class={styles.docsGroup} data-docs-section="">
    <h2 {@attach attachHeading} id={toDocsSectionId(props.title)} class={styles.docsGroupTitle}>{props.title}</h2>

    <p class={styles.docsLead}>{@render props.children?.()}</p>
</section>
