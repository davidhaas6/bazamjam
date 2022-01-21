import { FunctionComponent } from "react";

interface LoadingDisplayProps {
    text?: string;
}
 
const LoadingDisplay: FunctionComponent<LoadingDisplayProps> = (props: LoadingDisplayProps) => {
    return ( 
    <div className="error-display"> 
    Uh oh! :{'<'} 
    <br/>
    {props.text} 
    </div> );
}
 
export default LoadingDisplay;