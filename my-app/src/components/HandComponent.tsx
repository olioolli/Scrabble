import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { LetterTileComponent, LetterTileTransferData } from './LetterTileComponent';
import { getCurrentPlayerName } from '../util/utils';
import { useCallback } from 'react';
import { TileDropType } from './BoardTileComponent';

export type HandComponentProps = {
    letters: LetterTile[];
    tileDropped : (tile : LetterTile, dropType : TileDropType,x: number, y: number) => void;
}

export const HandComponent = (props: HandComponentProps) => {

    const [ letters, setLetters ] = useState<LetterTile[]>([]);

    const setOrderedLetters = (newLetters : LetterTile[]) => {
        const newLetterTiles = newLetters.filter( nl => letters.findIndex( letter => letter.id === nl.id ) === -1);
        const missingLetterTiles = letters.filter( letter => newLetters.findIndex( nl => nl.id === letter.id) === -1 );

        if( newLetterTiles.length === 0 && missingLetterTiles.length === 0 ) return;
        const orderedLetterArray = [...letters];
        missingLetterTiles.forEach( missingLetter => {
            const idx = orderedLetterArray.findIndex( letter => letter.id === missingLetter.id);
            orderedLetterArray.splice(idx,1);
        });

        newLetterTiles.forEach(newLetter => orderedLetterArray.push(newLetter));
        setLetters(orderedLetterArray);
    }

    useEffect( () => {
        //setLetterOrder(props.letters);
        //setLetters(props.letters);
        setOrderedLetters(props.letters);
    },[props.letters, setOrderedLetters])

    const calculateLeftPos = (i) => {
        const leftPosNumber = i * 40;
        return "" + leftPosNumber;
    }

    const setLetterOrder = useCallback((letterTiles : LetterTile[]) => {
        if( !letters ) return;

        for(let i = 0; i < letterTiles.length; i++) {
            const orderedIdx = letters.findIndex( l => l.id === letterTiles[i].id );
            if( orderedIdx > -1 && i !== orderedIdx ) {
                const temp = letterTiles[orderedIdx];
                letterTiles[orderedIdx] = letters[i];
                const tempIdx = letters.findIndex( ( stateLetter => stateLetter.id === temp.id ));
                if( tempIdx > -1 )
                    letterTiles[tempIdx] = temp;
            }
        }
    },[letters]);

    const handleDragDrop = (e) => {
        e.preventDefault();

        const letterTransferData = JSON.parse(e.dataTransfer.getData("text/plain")) as LetterTileTransferData;
        const letterTileEl = document.getElementById(letterTransferData.elementId);
        const letterTile = letterTransferData.letterTile;
        props.tileDropped(letterTile, TileDropType.BOARD_TO_HAND,-1,-1);
    };

    const handleLetterDrop = (letter : LetterTile, targetLetter : LetterTile) => {
        
        const movedLetterIdx = letters.findIndex( (propLetter => propLetter.id === letter.id));
        const targetTileIdx = letters.findIndex( (propLetter) => propLetter.id === targetLetter.id );

        if( movedLetterIdx < 0 || targetTileIdx < 0 ) return;

        const handLettersCopy = [ ...letters];
        const targetTile = handLettersCopy[targetTileIdx];
        handLettersCopy[targetTileIdx] = handLettersCopy[movedLetterIdx];
        handLettersCopy[movedLetterIdx] = targetTile;
        setLetters(handLettersCopy)
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <Div onDragOver={handleDragOver} onDrop={handleDragDrop}>
            {letters.map((letter, idx) => (
                <LetterTileComponent key={idx} isPlacedOnHand={true} tileDropped = {handleLetterDrop} letter={letter} leftPos={calculateLeftPos(idx)}></LetterTileComponent>
            ))}
        </Div>
    )
}

const Div = styled.div`
    margin-top: 10px;
    height: 50px;
    width: 500px;
    background-color: #636a3f;
    z-index: 10000;
    padding-left: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    border-radius: 6px;
    border: 2px solid #686433;
`;