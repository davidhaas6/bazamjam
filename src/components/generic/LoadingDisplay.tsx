import { FunctionComponent } from "react";

interface LoadingDisplayProps {
    text?: string;
}
 
const LoadingDisplay: FunctionComponent<LoadingDisplayProps> = (props: LoadingDisplayProps) => {
    return ( <div className="loading-display"> Loading :{'>'} </div> );
}
 
export default LoadingDisplay;