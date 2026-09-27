import { useState } from "react";

import type { Breadcrumb } from "@thewaver/ss-components";

import { Breadcrumbs, type TabLinkProps } from "../../src";

const TRAIL = ["home", "library", "inputs", "text"];

const LinkComponent = (props: TabLinkProps) => <a {...props} data-link-component />;

type TrailProps = {
    scope: string;
    isDisabled?: boolean;
    hasLinks?: boolean;
    hasSeparator?: boolean;
    hasLinkComponent?: boolean;
};

const Trail = ({ scope, isDisabled = false, hasLinks = false, hasSeparator = true, hasLinkComponent }: TrailProps) => {
    const [pressed, setPressed] = useState<string>();

    const crumbs: Breadcrumb<string>[] = TRAIL.map((value) => ({
        value,
        href: hasLinks ? `#breadcrumb-${value}` : undefined,
        isDisabled,
    }));

    return (
        <div data-testid={scope}>
            <Breadcrumbs
                ariaLabel={"Trail"}
                gap={8}
                crumbs={crumbs}
                linkComponent={hasLinkComponent ? LinkComponent : undefined}
                renderSeparator={hasSeparator ? () => <span>/</span> : undefined}
                renderCrumb={(crumb) => <span>{crumb.value}</span>}
                onSelect={setPressed}
            />
            <output data-readout="pressed">{`pressed: ${pressed ?? "nothing yet"}`}</output>
        </div>
    );
};

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => (
    <>
        <Trail scope="default" isDisabled={isDisabled} />
        <Trail scope="bare" hasSeparator={false} />
        <Trail scope="linked" hasLinks={true} />
        <Trail scope="linkComponent" hasLinks={true} hasLinkComponent={true} />
    </>
);
