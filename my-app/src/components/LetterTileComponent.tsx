import { useEffect } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { isMobileScreenWidth } from '../util/utils';

export type LetterTileTransferData = {
    letterTile : LetterTile;
    elementId : string;
};

export type LetterProps = {
    leftPos: string;
    letter : LetterTile
    tileDropped? : (letter : LetterTile, targetLetter : LetterTile) => void;
    tileClicked? : (targetLetter : LetterTile) => void;
    isPlacedOnSpecialTile? : boolean;
    isPlacedOnHand? : boolean;
    isSelected: boolean;
    setSelectedLetterTile: React.Dispatch<React.SetStateAction<LetterTile | undefined>>;
};

const getLetterTransferData = (letterTile : LetterTile, elementId : string ) => {
    return {
        letterTile : letterTile,
        elementId : elementId
    }
};

export const LetterTileComponent = (props : LetterProps) => {

    const isMobile = isMobileScreenWidth();
    const elementId = "letterTile_"+props.letter.id;

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

    const handleClick = () => {
        if( !isMobile ) return;

        if( props.tileClicked )
            props.tileClicked(props.letter);

        props.setSelectedLetterTile(props.isSelected ? undefined : props.letter);
    }

    const getTileStyle = () => {

        const isSelectedStyle = props.isSelected ? ' letterTile-selected' : '';
        const isMobileStyle = isMobile ? ' letterTile-onBoard-mobile' : '';
        if( props.isPlacedOnSpecialTile )
            return "letterTile letterTileTopFix"+isSelectedStyle+isMobileStyle;

        if( props.isPlacedOnHand )
            return "letterTile letterTileOnHand"+isSelectedStyle;
        else 
            return "letterTile"+isSelectedStyle+isMobileStyle;
    }

    return (
        <div onClick={handleClick} onDrop={handleDragDrop} onDragStart={ handleDragStart } draggable="true" className={getTileStyle()} id={elementId}>
            {props.letter.letter}
            <div className="letterPoint">
                {props.letter.points}
            </div>
        </div>
    );
};