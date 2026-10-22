<script lang="ts">
    import { PAGINATOR_DEFAULTS, PaginatorUtils } from "@thewaver/ss-components-svelte";
    import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
    import {
        COUNT_FIELD_WIDTH,
        EXAMPLES_ROOT,
        EXAMPLE_NAMES,
        STARTING_PAGE,
    } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import CountExample from "./Examples/Count.svelte";
    import DialExample from "./Examples/Dial.svelte";
    import EndsExample from "./Examples/Ends.svelte";
    import JumpExample from "./Examples/Jump.svelte";
    import LinkComponentExample from "./Examples/LinkComponent.svelte";
    import LinksExample from "./Examples/Links.svelte";
    import StepsExample from "./Examples/Steps.svelte";
    import type { PaginatorExampleProps } from "./PaginatorPageSvelte.types";

    let itemCount = $state(PaginatorKnobs.STARTING_ITEM_COUNT);
    let pageSize = $state(PaginatorKnobs.STARTING_PAGE_SIZE);
    let siblingCount = $state(PAGINATOR_DEFAULTS.siblingCount);
    let boundaryCount = $state(PAGINATOR_DEFAULTS.boundaryCount);
    let isDisabled = $state(PaginatorKnobs.STARTING_IS_DISABLED);

    let stepPage = $state(STARTING_PAGE);
    let endPage = $state(STARTING_PAGE);
    let linkPage = $state(STARTING_PAGE);
    let customLinkPage = $state(STARTING_PAGE);
    let dialPage = $state(STARTING_PAGE);
    let countPage = $state(STARTING_PAGE);
    let jumpPage = $state(STARTING_PAGE);

    const pageCount = $derived(PaginatorUtils.computePageCount(itemCount, pageSize));

    const commonProps: Omit<PaginatorExampleProps, "page" | "onPageChange"> = $derived({
        itemCount,
        pageSize,
        siblingCount,
        boundaryCount,
        isDisabled,
    });

    const examples: ExampleDefs[] = [
        {
            key: "steps",
            name: EXAMPLE_NAMES.steps,
            readout: () =>
                `page ${stepPage} of ${pageCount} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
            component: stepsExample,
            path: `${EXAMPLES_ROOT}/Steps.svelte`,
        },
        {
            key: "ends",
            name: EXAMPLE_NAMES.ends,
            readout: () =>
                `page ${endPage} of ${pageCount} — first and previous go quiet together on page one, and next and last on the final page`,
            component: endsExample,
            path: `${EXAMPLES_ROOT}/Ends.svelte`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            readout: () =>
                `page ${linkPage} of ${pageCount} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
            component: linksExample,
            path: `${EXAMPLES_ROOT}/Links.svelte`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () =>
                `page ${customLinkPage} of ${pageCount} — the same links rendered by a consumer's own link component`,
            component: linkComponentExample,
            path: `${EXAMPLES_ROOT}/LinkComponent.svelte`,
        },
        {
            key: "count",
            name: EXAMPLE_NAMES.count,
            readout: () =>
                `page ${countPage} of ${pageCount} — the steps piece with the page's own text in its slot, and no number row at all`,
            component: countExample,
            path: `${EXAMPLES_ROOT}/Count.svelte`,
        },
        {
            key: "jump",
            name: EXAMPLE_NAMES.jump,
            readout: () =>
                `page ${jumpPage} of ${pageCount} — the field is the page's own, writing the same page the row reads`,
            component: jumpExample,
            path: `${EXAMPLES_ROOT}/Jump.svelte`,
        },
        {
            key: "dial",
            name: EXAMPLE_NAMES.dial,
            readout: () =>
                `page ${dialPage} of ${pageCount} — one layout function, and the steps, pages and gaps become wedges in the order they already had`,
            component: dialExample,
            path: `${EXAMPLES_ROOT}/Dial.svelte`,
        },
    ];
</script>

{#snippet stepsExample()}
    <StepsExample
        {...commonProps}
        page={stepPage}
        onPageChange={(page) => {
            stepPage = page;
        }}
    />
{/snippet}

{#snippet endsExample()}
    <EndsExample
        {...commonProps}
        page={endPage}
        onPageChange={(page) => {
            endPage = page;
        }}
    />
{/snippet}

{#snippet linksExample()}
    <LinksExample
        {...commonProps}
        page={linkPage}
        onPageChange={(page) => {
            linkPage = page;
        }}
    />
{/snippet}

{#snippet linkComponentExample()}
    <LinkComponentExample
        {...commonProps}
        page={customLinkPage}
        onPageChange={(page) => {
            customLinkPage = page;
        }}
    />
{/snippet}

{#snippet dialExample()}
    <DialExample
        {...commonProps}
        page={dialPage}
        onPageChange={(page) => {
            dialPage = page;
        }}
    />
{/snippet}

{#snippet countExample()}
    <CountExample
        {...commonProps}
        page={countPage}
        onPageChange={(page) => {
            countPage = page;
        }}
    />
{/snippet}

{#snippet jumpExample()}
    <JumpExample
        {...commonProps}
        page={jumpPage}
        onPageChange={(page) => {
            jumpPage = page;
        }}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"itemCount"}
        controls={"Sets PaginatorProps.itemCount"}
        label={"Item count"}
        hint={"How many items there are to page through. The page count is worked out from this and the page size."}
    >
        <PageNumberField
            value={itemCount}
            min={PaginatorKnobs.MIN_ITEM_COUNT}
            max={PaginatorKnobs.MAX_ITEM_COUNT}
            step={PaginatorKnobs.COUNT_STEP}
            width={COUNT_FIELD_WIDTH}
            ariaLabel={"Item count"}
            onInput={(value) => {
                itemCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"pageSize"}
        controls={"Sets PaginatorProps.pageSize"}
        label={"Page size"}
        hint={"How many items one page holds. The last page holds whatever is left over."}
    >
        <PageNumberField
            value={pageSize}
            min={PaginatorKnobs.MIN_PAGE_SIZE}
            max={PaginatorKnobs.MAX_PAGE_SIZE}
            step={PaginatorKnobs.COUNT_STEP}
            width={COUNT_FIELD_WIDTH}
            ariaLabel={"Page size"}
            onInput={(value) => {
                pageSize = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"siblingCount"}
        controls={"Sets PaginatorProps.siblingCount"}
        label={"Sibling count"}
        hint={"How many pages are shown on each side of the current one before the run is broken by an ellipsis."}
    >
        <PageNumberField
            value={siblingCount}
            min={PaginatorKnobs.MIN_COUNT}
            max={PaginatorKnobs.MAX_COUNT}
            step={PaginatorKnobs.COUNT_STEP}
            width={COUNT_FIELD_WIDTH}
            ariaLabel={"Sibling count"}
            onInput={(value) => {
                siblingCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"boundaryCount"}
        controls={"Sets PaginatorProps.boundaryCount"}
        label={"Boundary count"}
        hint={"How many pages are always shown at each end, however far away the current page is."}
    >
        <PageNumberField
            value={boundaryCount}
            min={PaginatorKnobs.MIN_COUNT}
            max={PaginatorKnobs.MAX_COUNT}
            step={PaginatorKnobs.COUNT_STEP}
            width={COUNT_FIELD_WIDTH}
            ariaLabel={"Boundary count"}
            onInput={(value) => {
                boundaryCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        controls={"Sets PaginatorProps.isDisabled"}
        label={"Disabled"}
        hint={"Turns the paginator off, so none of its pages or arrows respond."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={400} />
