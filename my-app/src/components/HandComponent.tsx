import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { LetterTileComponent } from './LetterTileComponent';
import { getCurrentPlayerName } from '../util/utils';
import { useCallback } from 'react';

export type HandComponentProps = {
    letters : LetterTile[];
}

export const HandComponent = (props : HandComponentProps) => {

    const calculateLeftPos = (i) => {
        const leftPosNumber = i * 40;
        return ""+leftPosNumber;
    }

    return (
        <Div>
            {props.letters.map( (letter, idx) => (
               <LetterTileComponent letter={letter} leftPos={calculateLeftPos(idx)}></LetterTileComponent> 
            ))}
        </Div>
    )
}

const Div = styled.div`
margin-top: 10px;
height: 50px;
width: 500px;
background-color: #989a8e;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
`;