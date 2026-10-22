<script lang="ts">
    import type { PaginatorProps } from "./Paginator.types.js";
    import PaginatorPages from "./PaginatorPages.svelte";
    import PaginatorRoot from "./PaginatorRoot.svelte";
    import PaginatorSteps from "./PaginatorSteps.svelte";

    let props: PaginatorProps = $props();
</script>

<PaginatorRoot
    itemCount={props.itemCount}
    pageSize={props.pageSize}
    page={props.page}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    linkComponent={props.linkComponent}
    computeHref={props.computeHref}
    computeLayout={props.computeLayout}
    computeEffect={props.computeEffect}
    onPageChange={props.onPageChange}
>
    <PaginatorSteps
        steps={props.steps}
        gap={props.gap}
        computeStepLabel={props.computeStepLabel}
        renderStep={props.renderStep}
    >
        <PaginatorPages
            siblingCount={props.siblingCount}
            boundaryCount={props.boundaryCount}
            gap={props.gap}
            computePageLabel={props.computePageLabel}
            renderPage={props.renderPage}
            renderGap={props.renderGap}
        />
    </PaginatorSteps>
</PaginatorRoot>
