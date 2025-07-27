import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { LetterTile } from '../../../scrabble-backend/server'
import { LetterTileComponent, LetterTileTransferData } from './LetterTileComponent'
import { getCurrentPlayerName } from '../util/utils'
import { useCallback } from 'react'
import { TileDropType } from './BoardTileComponent'

export type HandComponentProps = {
  letters: LetterTile[]
  tileDropped: (tile: LetterTile, dropType: TileDropType, x: number, y: number) => void
  selectedLetterTile: LetterTile | undefined
  setSelectedLetterTile: React.Dispatch<React.SetStateAction<LetterTile | undefined>>
}

export const HandComponent = (props: HandComponentProps) => {
  const [letters, setLetters] = useState<LetterTile[]>([])

  const setOrderedLetters = (newLetters: LetterTile[]) => {
    const newLetterTiles = newLetters.filter(
      (nl) => letters.findIndex((letter) => letter.id === nl.id) === -1
    )
    const missingLetterTiles = letters.filter(
      (letter) => newLetters.findIndex((nl) => nl.id === letter.id) === -1
    )

    if (newLetterTiles.length === 0 && missingLetterTiles.length === 0) return
    const orderedLetterArray = [...letters]
    missingLetterTiles.forEach((missingLetter) => {
      const idx = orderedLetterArray.findIndex((letter) => letter.id === missingLetter.id)
      orderedLetterArray.splice(idx, 1)
    })

    newLetterTiles.forEach((newLetter) => orderedLetterArray.push(newLetter))
    setLetters(orderedLetterArray)
  }

  useEffect(() => {
    setOrderedLetters(props.letters)
  }, [props.letters, setOrderedLetters])

  const calculateLeftPos = (i) => {
    const leftPosNumber = i * 40
    return '' + leftPosNumber
  }

  const handleDragDrop = (e) => {
    e.preventDefault()

    const letterTransferData = JSON.parse(
      e.dataTransfer.getData('text/plain')
    ) as LetterTileTransferData
    const letterTile = letterTransferData.letterTile
    props.tileDropped(letterTile, TileDropType.BOARD_TO_HAND, -1, -1)
  }

  const handleLetterDrop = (letter: LetterTile, targetLetter: LetterTile) => {
    const movedLetterIdx = letters.findIndex((propLetter) => propLetter.id === letter.id)
    const targetTileIdx = letters.findIndex((propLetter) => propLetter.id === targetLetter.id)

    if (movedLetterIdx < 0 || targetTileIdx < 0) return

    const handLettersCopy = [...letters]
    const targetTile = handLettersCopy[targetTileIdx]
    handLettersCopy[targetTileIdx] = handLettersCopy[movedLetterIdx]
    handLettersCopy[movedLetterIdx] = targetTile
    setLetters(handLettersCopy)
  }

  const handleTileClicked = (targetLetter: LetterTile) => {
    if (props.selectedLetterTile) handleLetterDrop(props.selectedLetterTile, targetLetter)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleClick = () => {
    if (!props.selectedLetterTile) return

    props.tileDropped(props.selectedLetterTile, TileDropType.BOARD_TO_HAND, -1, -1)
  }

  const isTileSelected = (letterId: number) => {
    if (!props.selectedLetterTile) return false

    return letterId === props.selectedLetterTile.id
  }

  return (
    <Div onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDragDrop}>
      {letters.map((letter, idx) => (
        <LetterTileComponent
          isSelected={isTileSelected(letter.id)}
          setSelectedLetterTile={props.setSelectedLetterTile}
          key={idx}
          isPlacedOnHand={true}
          tileDropped={handleLetterDrop}
          tileClicked={handleTileClicked}
          letter={letter}
          leftPos={calculateLeftPos(idx)}
        ></LetterTileComponent>
      ))}
    </Div>
  )
}

const Div = styled.div`
  margin-top: 10px;
  height: 50px;
  width: 300px;
  background-color: #636a3f;
  z-index: 10000;
  padding-left: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 6px;
  border: 2px solid #686433;
`
