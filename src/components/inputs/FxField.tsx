import { FunctionComponent } from "react";
import { EssentiaFx, normalizeJsonArr } from "../../logic/network";

interface FxFieldProps {
  function: EssentiaFx;
}

const FxField: FunctionComponent<FxFieldProps> = (props: FxFieldProps) => {
  const { name, header, desc, params: rawParams, returnData } = props.function;
  const params = rawParams?.Name != null ? normalizeJsonArr(rawParams!.Name) : null;
  return (
    <div>

      <div className="fx-name">{name}</div>
      <br />
      {desc}
      <br /><br />
      {params && params.join(', ')}
      <br />
      {/* {desc} */}
    </div>);
}

export default FxField;