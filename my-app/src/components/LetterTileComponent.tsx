import { useEffect } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';

export type LetterTileTransferData = {
    letterTile : LetterTile;
    elementId : string;
};

export type LetterProps = {
    leftPos: string;
    letter : LetterTile
};

const getLetterTransferData = (letterTile : LetterTile, elementId : string ) => {
    return {
        letterTile : letterTile,
        elementId : elementId
    }
};

let idCounter = 0;

export const LetterTileComponent = (props : LetterProps) => {

    const id = idCounter++;
    const elementId = "letterTile_"+props.letter.id;

    const style = {
        left: props.leftPos+"px"
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(getLetterTransferData(props.letter, elementId)));
    }

    return (
        <div onDragStart={ handleDragStart } draggable="true" className="letterTile" id={elementId}>
            {props.letter.letter}
            <div className="letterPoint">
                {props.letter.points}
            </div>
        </div>
    );
};