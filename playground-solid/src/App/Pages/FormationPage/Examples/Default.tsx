import { createMemo, splitProps } from "solid-js";

import { Formation, PlacementLayoutUtils, ProximityEffectUtils, access } from "@thewaver/ss-components-solid";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPageSolid.types";

type Props = FormationExampleProps;

export const DefaultExample = (props: Props) => {
    const [, otherProps] = splitProps(props, ["layoutEntry", "effectEntry", "shapeKind"]);

    const getComputeEffect = createMemo(() => {
        const entry = access(props.effectEntry);

        return entry === undefined ? undefined : ProximityEffectUtils.toEffectFn(entry);
    });

    return (
        <Formation
            {...otherProps}
            computeLayout={(defs) => PlacementLayoutUtils.toLayoutFn(access(props.layoutEntry))(defs)}
            computeEffect={getComputeEffect()}
            renderItem={(getItem, getState) => (
                <PageFormationItem state={getState} shapeKind={props.shapeKind}>
                    {getItem()}
                </PageFormationItem>
            )}
        />
    );
};
