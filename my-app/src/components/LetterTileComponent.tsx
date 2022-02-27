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
    tileDropped? : (letter : LetterTile, targetLetter : LetterTile) => void;
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

    const handleDragDrop = (e) => {
        e.preventDefault();

        const letterTransferData = JSON.parse(e.dataTransfer.getData("text/plain")) as LetterTileTransferData;
        const letterTile = letterTransferData.letterTile;

        if( props.tileDropped ) 
            props.tileDropped(letterTile, props.letter);
    }

    return (
        <div onDrop={handleDragDrop} onDragStart={ handleDragStart } draggable="true" className="letterTile" id={elementId}>
            {props.letter.letter}
            <div className="letterPoint">
                {props.letter.points}
            </div>
        </div>
    );
};