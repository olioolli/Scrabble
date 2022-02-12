import { useEffect } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { LetterTileComponent } from './LetterTileComponent';

export const N0R = 0,
    X2W = 1,
    X3W = 2,
    X2L = 3,
    X3L = 4,
    CNT = 5;

export type BoardTileComponentProps = {
    tileDropped : (tile : LetterTile, x: number, y: number, isTargetPouch : boolean) => void,
    tileType : number,
    tileXPos : number,
    tileYPos : number,
    letterTile : LetterTile | undefined
};

export const BoardTileComponent = (props) => {

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        if (!e.target.classList.contains("grid-item") && e.target.id !== 'pouch')
            return;

        e.target.classList.add("grid-item-highlight");
    };

    const handleDragLeave = (e) => {
        if (!e.target.classList.contains("grid-item") )
            return;

        e.target.classList.remove("grid-item-highlight");
    };

    const handleDragDrop = (e) => {
        e.preventDefault();

        e.target.classList.remove("grid-item-highlight");

        const letterData = JSON.parse(e.dataTransfer.getData("text/plain")) as LetterTile;
        const letterTileEl = document.getElementById("letterTile_"+letterData.id);

        // Dropped on pouch
        if( e.target.id === 'pouch' ) {
            props.tileDropped(letterData, -1,-1,true);
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

        props.tileDropped(letterData, props.tileXPos, props.tileYPos, false);
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
            return "blue";
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
        onDragEnter={handleDragEnter} 
        onDragLeave={handleDragLeave} 
        onDrop={handleDragDrop} 
        style={getTileStyle(props.tileType)}>
            {getTileTextFromProps(props.tileType)}
            {getLetterTileFromProps()}
        </div>
    )
}