import { ShadowCaster } from "../../src";

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => (
    <div data-testid="frame" style={{ width: 200, height: 100, margin: 200 }}>
        <ShadowCaster color="#FF0000" lightRangePx={400} isDisabled={isDisabled}>
            <div data-testid="surface" style={{ width: 200, height: 100, background: "#eee" }} />
        </ShadowCaster>
    </div>
);
