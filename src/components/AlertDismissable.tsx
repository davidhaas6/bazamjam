import { FunctionComponent, useState } from "react";
import { Alert, Button } from "react-bootstrap";

interface IAlertDismissableProps {
    header: string;
    message: string;
    closeMessage?: string;
    variant?: "success" | "danger" | "warning" | "info";
}

const AlertDismissable: FunctionComponent<IAlertDismissableProps> = (props: IAlertDismissableProps) => {
    const [show, setShow] = useState(true);
    let variant = props.variant || "success";

    return (
        <>
            <Alert show={show} variant={variant} 
            onClose={() => setShow(false)} 
            dismissible={true}
            >
                <Alert.Heading>{props.header}</Alert.Heading>
                {props.message}
            </Alert>
        </>
    );
}

export default AlertDismissable;