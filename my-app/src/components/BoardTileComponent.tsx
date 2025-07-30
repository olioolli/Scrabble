import { useRef } from 'react'
import styled from 'styled-components'
import { LetterTile } from '../../../scrabble-backend/server'
import { isMobileScreenWidth } from '../util/utils'
import { LetterTileComponent, LetterTileTransferData } from './LetterTileComponent'

export const N0R = 0,
  X2W = 1,
  X3W = 2,
  X2L = 3,
  X3L = 4,
  CNT = 5

export enum TileDropType {
  HAND_TO_POUCH = 1,
  HAND_TO_BOARD = 2,
  BOARD_TO_BOARD = 3,
  BOARD_TO_HAND = 4,
}

export type BoardTileComponentProps = {
  tileDropped: (tile: LetterTile, dropType: TileDropType, x: number, y: number) => void
  tileType: number
  tileXPos: number
  tileYPos: number
  letterTile: LetterTile | undefined
  selectedLetterTile: LetterTile | undefined
  setSelectedLetterTile: React.Dispatch<React.SetStateAction<LetterTile | undefined>>
}

export const BoardTileComponent = (props) => {
  const isMobile = isMobileScreenWidth()
  const mainDivRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const gridElementContainsTileElement = (gridElement: HTMLElement) => {
    const gridE = gridElement.classList.contains('grid-item')
      ? gridElement
      : gridElement.parentElement
    return gridE && gridE.childElementCount > 1
  }

  // Returns True if tile was dragged from a board tile to a board tile (as opposed to from hand onto the board)
  const isOnBoardDrag = (letterTileEl: HTMLElement | null) => {
    if (letterTileEl === null || letterTileEl.parentElement === null) return false

    return letterTileEl.parentElement.classList.contains('grid-item')
  }

  const isDropAllowed = (dropTarget: HTMLElement) => {
    if (gridElementContainsTileElement(dropTarget)) return false

    const targetBoardTile =
      dropTarget.childElementCount === 0 ? dropTarget.parentElement : dropTarget
    if (!targetBoardTile) return false

    if (
      !targetBoardTile.classList.contains('grid-item') &&
      !targetBoardTile.classList.contains('letterTile')
    )
      return false

    return true
  }

  const placeLetterTileOnBoard = (letterData: LetterTile, target: HTMLElement) => {
    if (!isDropAllowed(target)) return

    const letterTileElementId = 'letterTile_' + letterData.id
    const letterTileEl = document.getElementById(letterTileElementId)

    // board tile to board tile
    if (isOnBoardDrag(letterTileEl)) {
      props.tileDropped(letterData, TileDropType.BOARD_TO_BOARD, props.tileXPos, props.tileYPos)
      return
    }

    // Dropped on pouch
    if (target.id === 'pouch') {
      props.tileDropped(letterData, TileDropType.HAND_TO_POUCH)
      return
    }

    // Check if dropped on boardTile
    if (!letterTileEl || !target.classList.contains('grid-item'))
      if (
        !letterTileEl ||
        (target.parentElement && !target.parentElement.classList.contains('grid-item'))
      )
        // check if dropped on special board tile (on the worddiv)
        return

    letterTileEl.style.left = ''

    props.tileDropped(letterData, TileDropType.HAND_TO_BOARD, props.tileXPos, props.tileYPos)
  }

  const handleDragDrop = (e) => {
    e.preventDefault()

    const letterTransferData = JSON.parse(
      e.dataTransfer.getData('text/plain')
    ) as LetterTileTransferData
    const letterData = letterTransferData.letterTile

    placeLetterTileOnBoard(letterData, e.target)
  }

  const getTileStyle = (tileType) => {
    return {
      fontSize: '11px',
      background: getTileColorFromProps(tileType),
    }
  }

  const getTileColorFromProps = (tileType) => {
    if (tileType == X2W) return '#ffc0cbb5'
    else if (tileType == X3W) return '#ff0000a6'
    else if (tileType == X2L) return '#00ffffb3'
    else if (tileType == X3L) return '#4a4a91'
    else if (tileType == CNT) return '#ff000073'

    return ''
  }

  const getTileTextFromProps = (tileType) => {
    if (tileType == X2W) return isMobile ? '2xW' : '2xWord'
    else if (tileType == X3W) return isMobile ? '3xW' : '3xWord'
    else if (tileType == X2L) return isMobile ? '2xL' : '2xLetter'
    else if (tileType == X3L) return isMobile ? '3xL' : '3xLetter'

    return ''
  }

  const isLetterTileSelected = () => {
    if (!props.selectedLetterTile) return false

    return props.selectedLetterTile.id === props.letterTile.id
  }

  const getLetterTileFromProps = () => {
    if (!props.letterTile) return null

    return (
      <LetterTileComponent
        isSelected={isLetterTileSelected()}
        setSelectedLetterTile={props.setSelectedLetterTile}
        isPlacedOnSpecialTile={getTileTextFromProps(props.tileType) !== ''}
        letter={props.letterTile}
        leftPos={'0'}
      ></LetterTileComponent>
    )
  }

  const handleBoardTileClicked = () => {
    if (!props.selectedLetterTile || !mainDivRef.current) return

    placeLetterTileOnBoard(props.selectedLetterTile, mainDivRef.current)
  }

  return (
    <div
      className="grid-item"
      ref={mainDivRef}
      onClick={handleBoardTileClicked}
      onDragOver={handleDragOver}
      onDrop={handleDragDrop}
      style={getTileStyle(props.tileType)}
    >
      <TileTextDiv
        isMobile={isMobile}
        isSpecialTile={props.tileType !== N0R}
        onDragOver={handleDragOver}
      >
        {getTileTextFromProps(props.tileType)}
      </TileTextDiv>
      {getLetterTileFromProps()}
    </div>
  )
}

const TileTextDiv = styled.div`
  font-size: ${(props) => (props.isMobile ? '8px' : '10px')};
  margin-top: 32%;
  text-align: center;
  position: ${(props) => (props.isMobile ? 'relative' : 'initial')};
  bottom: ${(props) => (props.isMobile ? '3px' : 'initial')};
`
