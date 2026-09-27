import { TypeaheadReactUtils } from "../../src";

export const Default = ({ timeoutMs }: { timeoutMs?: number }) => {
    const { query, push } = TypeaheadReactUtils.useBuffer({ timeoutMs });

    return (
        <>
            <input data-testid="field" onKeyDown={(e) => push(e.nativeEvent)} />
            <output data-readout="query">{JSON.stringify(query)}</output>
        </>
    );
};
