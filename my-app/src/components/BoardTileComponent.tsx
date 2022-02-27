import { useEffect } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { LetterTileComponent, LetterTileTransferData } from './LetterTileComponent';

export const N0R = 0,
    X2W = 1,
    X3W = 2,
    X2L = 3,
    X3L = 4,
    CNT = 5;

export enum TileDropType {
    HAND_TO_POUCH = 1,
    HAND_TO_BOARD = 2,
    BOARD_TO_BOARD = 3,
    BOARD_TO_HAND = 4,
}

export type BoardTileComponentProps = {
    tileDropped : (tile : LetterTile, dropType : TileDropType,x: number, y: number) => void,
    tileType : number,
    tileXPos : number,
    tileYPos : number,
    letterTile : LetterTile | undefined
};

export const BoardTileComponent = (props) => {

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const gridElementContainsTileElement = (gridElement : HTMLElement) => {
        return gridElement.childElementCount > 0;
    }
/*
    const handleDragEnter = (e) => {
        if( isDropAllowed(e.target) ) return;
        e.target.classList.add("grid-item-highlight");
    };

    const handleDragLeave = (e) => {
        if (!e.target.classList.contains("grid-item") )
            return;

        e.target.classList.remove("grid-item-highlight");
    };
*/
    // Returns True if tile was dragged from a board tile to a board tile (as opposed to from hand onto the board)
    const isOnBoardDrag = (letterTileEl : HTMLElement | null) => {
        if( letterTileEl === null || letterTileEl.parentElement === null ) return false;
        
        return letterTileEl.parentElement.classList.contains("grid-item");
    }

    const isDropAllowed = (droppedElement : HTMLElement) => {
        if( !droppedElement.classList.contains("grid-item") && !droppedElement.classList.contains("letterTile"))
            return false;

        if( gridElementContainsTileElement(droppedElement) )
            return false;

        return true;
    };

    const handleDragDrop = (e) => {
        e.preventDefault();

        if( !isDropAllowed(e.target) ) return;

        e.target.classList.remove("grid-item-highlight");

        const letterTransferData = JSON.parse(e.dataTransfer.getData("text/plain")) as LetterTileTransferData;
        const letterTileEl = document.getElementById(letterTransferData.elementId);
        const letterData = letterTransferData.letterTile;

        // board tile to board tile
        if( isOnBoardDrag(letterTileEl) ) {
            props.tileDropped(letterData, TileDropType.BOARD_TO_BOARD, props.tileXPos, props.tileYPos);
            return;
        }

        // Dropped on pouch
        if( e.target.id === 'pouch' ) {
            props.tileDropped(letterData, TileDropType.HAND_TO_POUCH);
            return;
        }

        if (!letterTileEl || !e.target.classList.contains("grid-item"))
            return;

        if (e.target.childElementCount > 0)
            return;

        if (props.tileType > 0 )
            letterTileEl.style.top = "-18px";

        letterTileEl.style.left = "";
        //e.target.appendChild(letterTileEl);
        
        const letter = letterTileEl.innerText.charAt(0);
        const points = parseInt(letterTileEl.children[0].innerHTML);

        props.tileDropped(letterData, TileDropType.HAND_TO_BOARD, props.tileXPos, props.tileYPos);
    };

    const getTileStyle = (tileType) => {

        return {
            fontSize: "11px",
            background: getTileColorFromProps(tileType)
        }
    }

    const getTileColorFromProps = (tileType) => {

        if (tileType == X2W)
            return "pink";
        else if (tileType == X3W)
            return "red";
        else if (tileType == X2L)
            return "cyan";
        else if (tileType == X3L)
            return "#4a4a91";
        else if (tileType == CNT)
            return "red";

        return "";
    }

    const getTileTextFromProps = (tileType) => {

        if (tileType == X2W)
            return "2xWord";
        else if (tileType == X3W)
            return "3xWord";
        else if (tileType == X2L)
            return "2xLetter";
        else if (tileType == X3L)
            return "3xLetter";

        return "";
    }

    const getLetterTileFromProps = () => {
        if( !props.letterTile )
            return null;
        
        return (
            <LetterTileComponent letter={props.letterTile} leftPos={"0"}></LetterTileComponent>
        )
    }

    return (
        <div className="grid-item" 
        onDragOver={handleDragOver} 
        //onDragEnter={handleDragEnter} 
        //onDragLeave={handleDragLeave} 
        onDrop={handleDragDrop} 
        style={getTileStyle(props.tileType)}>
            {getTileTextFromProps(props.tileType)}
            {getLetterTileFromProps()}
        </div>
    )
}