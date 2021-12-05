import { FunctionComponent, useState } from "react";
import { Alert, Button } from "react-bootstrap";

interface IAlertDismissableProps {
    header: string;
    message: string;
    closeMessage?: string;
    center?: boolean;
}

const AlertDismissable: FunctionComponent<IAlertDismissableProps> = (props: IAlertDismissableProps) => {
    const [show, setShow] = useState(true);

    let alertStyle = props.center ? {"margin": "auto"} : {};

    return (
        <>
            <Alert show={show} variant="success" className="alert" style={alertStyle} dismissible={true}>
                <Alert.Heading>{props.header}</Alert.Heading>
                    {props.message}
            </Alert>            
        </>
    );
}

export default AlertDismissable;