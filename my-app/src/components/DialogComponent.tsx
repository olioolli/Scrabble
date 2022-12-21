import styled from 'styled-components';

export type DialogComponentProps = {
    text : string;
    okText: string;
    cancelText: string;
    cancelClicked: () => void;
    okClicked: () => void;
}

export const DialogComponent = (props : DialogComponentProps) => {

    return (
        <MainDiv>
            {props.text}
            <HorizontalDiv>
                <ButtonOk onClick={ () => props.okClicked() }>{props.okText}</ButtonOk>
                <ButtonCancel onClick={ () => props.cancelClicked() }> {props.cancelText}</ButtonCancel>
            </HorizontalDiv>
        </MainDiv>
    )
}

const HorizontalDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

const MainDiv = styled.div`
z-index: 10;
position: absolute;
    max-width: 800px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background: #636a3f;
    height: 150px;
    width: 250px;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #383333;
    -webkit-box-shadow: 5px 5px 15px 5px rgb(0 0 0 / 20%);
    box-shadow: 5px 5px 15px 5px rgb(0 0 0 / 20%);
    justify-content: space-around;
    align-items: center;
    z-index: 20000
`;

const ButtonOk = styled.button`
width: 80px;
    padding: 10px;
    background: #eef1e3;
    color: green;
    font-weight: bold;
    text-decoration: underline;
`;

const ButtonCancel = styled.button`
width: 80px;
padding: 10px;
color: red;
background: #eef1e3;
font-weight: bold;
}
`;
