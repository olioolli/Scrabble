import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PlayerInfo, PlayerInfoProps } from './PlayerInfoComponent';

export type PlayerInfoPopupComponentProps = Pick<PlayerInfoProps,"pointsUpdated" | "name" | "points" | "setOpenWndPlayerName">

export const PlayerInfoPopupComponent = (props : PlayerInfoPopupComponentProps) => {

    return (
        <MainDiv>
            <PlayerInfo pointsUpdated={props.pointsUpdated} 
            isActive={false} name={props.name} 
            points={props.points}
            playerInfoClicked={() => {}}
            showBigControls={true}
            setOpenWndPlayerName={props.setOpenWndPlayerName}
            ></PlayerInfo>
        </MainDiv>
    )
}

const MainDiv = styled.div`
position: absolute;
background: #636a3f;
border: black;
border-radius: 4px;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
padding: 16px;
z-index: 10001;
border: 1px solid #767676;
`