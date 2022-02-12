import { useEffect } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';

export type LetterProps = {
    leftPos: string;
    letter : LetterTile
}

let idCounter = 0;

export const LetterTileComponent = (props : LetterProps) => {

    const id = idCounter++;

    const style = {
        left: props.leftPos+"px"
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(props.letter));
    }

    return (
        <div onDragStart={ handleDragStart } draggable="true" className="letterTile" id={"letterTile_"+props.letter.id}>
            {props.letter.letter}
            <div className="letterPoint">
                {props.letter.points}
            </div>
        </div>
    );
};