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
    isPlacedOnSpecialTile? : boolean;
    isPlacedOnHand? : boolean;
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

    const tileStyle = props.isPlacedOnSpecialTile ? "letterTile letterTileTopFix" : props.isPlacedOnHand ? "letterTile letterTileOnHand" : "letterTile";

    return (
        <div onDrop={handleDragDrop} onDragStart={ handleDragStart } draggable="true" className={tileStyle} id={elementId}>
            {props.letter.letter}
            <div className="letterPoint">
                {props.letter.points}
            </div>
        </div>
    );
};