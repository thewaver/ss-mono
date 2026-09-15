import { createMemo } from "solid-js";

import { Formation, PlacementLayoutUtils, ProximityEffectUtils, access } from "@thewaver/ss-components";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPage.types";

type Props = FormationExampleProps;

export const DefaultExample = ({ layoutEntry, effectEntry, shapeKind, ...otherProps }: Props) => {
    const getComputeEffect = createMemo(() => {
        const entry = access(effectEntry);

        return entry === undefined ? undefined : ProximityEffectUtils.toEffectFn(entry);
    });

    return (
        <Formation
            {...otherProps}
            computeLayout={(defs) => PlacementLayoutUtils.toLayoutFn(access(layoutEntry))(defs)}
            computeEffect={getComputeEffect()}
            renderItem={(getItem, getState) => (
                <PageFormationItem state={getState} shapeKind={shapeKind}>
                    {getItem()}
                </PageFormationItem>
            )}
        />
    );
};
