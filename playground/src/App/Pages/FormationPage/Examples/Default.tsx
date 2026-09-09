import { FittedLayouts, Formation, access } from "@thewaver/ss-components";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPage.types";

type Props = FormationExampleProps;

export const DefaultExample = ({ layoutKey, shapeKind, ...otherProps }: Props) => {
    return (
        <Formation
            {...otherProps}
            computeLayout={(defs) => FittedLayouts.SAMPLE_LAYOUTS[access(layoutKey)](defs)}
            renderItem={(getItem, getState) => (
                <PageFormationItem state={getState} shapeKind={shapeKind}>
                    {getItem()}
                </PageFormationItem>
            )}
        />
    );
};
