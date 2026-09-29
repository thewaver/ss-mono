<script lang="ts">
    import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DialExample from "./Examples/Dial.svelte";
    import EndsExample from "./Examples/Ends.svelte";
    import LinkComponentExample from "./Examples/LinkComponent.svelte";
    import LinksExample from "./Examples/Links.svelte";
    import StepsExample from "./Examples/Steps.svelte";
    import type { PaginatorExampleProps } from "./PaginatorPage.types";

    const STARTING_PAGE = 1;
    const COUNT_FIELD_WIDTH = 90;
    const EXAMPLES_ROOT = "/src/App/Pages/PaginatorPage/Examples";

    let pageCount = $state(PaginatorKnobs.STARTING_PAGE_COUNT);
    let siblingCount = $state(PAGINATOR_DEFAULTS.siblingCount);
    let boundaryCount = $state(PAGINATOR_DEFAULTS.boundaryCount);
    let isDisabled = $state(PaginatorKnobs.STARTING_IS_DISABLED);

    let stepPage = $state(STARTING_PAGE);
    let endPage = $state(STARTING_PAGE);
    let linkPage = $state(STARTING_PAGE);
    let customLinkPage = $state(STARTING_PAGE);
    let dialPage = $state(STARTING_PAGE);

    const commonProps: Omit<PaginatorExampleProps, "page" | "onPageChange"> = $derived({
        pageCount,
        siblingCount,
        boundaryCount,
        isDisabled,
    });

    const examples: ExampleDefs[] = [
        {
            key: "steps",
            name: "Previous and next",
            readout: () =>
                `page ${stepPage} of ${pageCount} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
            component: stepsExample,
            path: `${EXAMPLES_ROOT}/Steps.svelte`,
        },
        {
            key: "ends",
            name: "Jumps to either end",
            readout: () =>
                `page ${endPage} of ${pageCount} — first and previous go quiet together on page one, and next and last on the final page`,
            component: endsExample,
            path: `${EXAMPLES_ROOT}/Ends.svelte`,
        },
        {
            key: "links",
            name: "Pages that are links",
            readout: () =>
                `page ${linkPage} of ${pageCount} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
            component: linksExample,
            path: `${EXAMPLES_ROOT}/Links.svelte`,
        },
        {
            key: "linkComponent",
            name: "Links through a component",
            readout: () =>
                `page ${customLinkPage} of ${pageCount} — the same links rendered by a consumer's own link component`,
            component: linkComponentExample,
            path: `${EXAMPLES_ROOT}/LinkComponent.svelte`,
        },
        {
            key: "dial",
            name: "The same row, round half a dial",
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

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"pageCount"} label={"Page count"} hint={"How many pages there are to page through."}>
        <PageNumberField
            value={pageCount}
            min={PaginatorKnobs.MIN_PAGE_COUNT}
            max={PaginatorKnobs.MAX_PAGE_COUNT}
            step={PaginatorKnobs.COUNT_STEP}
            width={COUNT_FIELD_WIDTH}
            ariaLabel={"Page count"}
            onInput={(value) => {
                pageCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"siblingCount"}
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
