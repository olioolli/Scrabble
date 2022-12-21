import { useCallback } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';
import { isMobileScreenWidth } from '../util/utils';
import { TileDropType } from './BoardTileComponent';
import { LetterTileTransferData } from './LetterTileComponent';

export type PouchComponentProps = {
  letters: LetterTile[];
  tileDropped : (tile : LetterTile, dropType : TileDropType,x: number, y: number) => void;
  selectedLetterTile: LetterTile | undefined;
  setSelectedLetterTile: React.Dispatch<React.SetStateAction<LetterTile | undefined>>;
}

export const PouchComponent = (props) => {

  const [isMouseOver, setMouseOver] = useState(false);
  const isMobile = isMobileScreenWidth();

  const style = {
    width: "80px",
    height: "80px",
  };

  const handleSvgMouseOver = useCallback(() => {
    setMouseOver(true);
  }, []);

  const handleSvgMouseOut = useCallback(() => {
    setMouseOver(false);
  }, []);

  const handleDragDrop = (e) => {
    e.preventDefault();

    e.target.classList.remove("grid-item-highlight");

    const letterTransferData = JSON.parse(e.dataTransfer.getData("text/plain")) as LetterTileTransferData;
    const letterData = letterTransferData.letterTile;

    props.tileDropped(letterData, TileDropType.HAND_TO_POUCH);
  };

  const handleDragOver = (e) => {
    e.preventDefault();

  };
  const handleClick = () => {
    if( !props.selectedLetterTile ) return;

    props.setSelectedLetterTile(undefined);
    props.tileDropped(props.selectedLetterTile, TileDropType.HAND_TO_POUCH);
  }

  const mainDivStyle = {
    'cursor': 'pointer',
    '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
    'margin-top' : isMobile ? '1rem' : 'initial'
  }

  return (
    <div onClick={handleClick} onDragOver={handleDragOver}  onDrop={handleDragDrop} id={'pouch'} style={mainDivStyle}>
      <svg onDragOver={handleDragOver}  onDrop={handleDragDrop} onMouseLeave={handleSvgMouseOut} onMouseOver={handleSvgMouseOver} style={style} version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="924.000000pt" height="1280.000000pt" viewBox="0 0 924.000000 1280.000000"
        preserveAspectRatio="xMidYMid meet">
        <metadata>
          Created by potrace 1.15, written by Peter Selinger 2001-2017
        </metadata>
        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
          fill={isMouseOver && !isMobile ? "cyan" : "#eef1e3"} stroke="none">
          <path d="M5080 12790 c-91 -4 -190 -13 -220 -19 -30 -7 -138 -21 -240 -31
  -542 -59 -828 -105 -1100 -179 -41 -12 -131 -34 -200 -51 -962 -229 -1486
  -540 -1550 -920 -28 -165 19 -309 167 -518 162 -228 374 -462 759 -837 385
  -376 486 -492 557 -643 60 -127 39 -255 -59 -370 -20 -23 -61 -63 -91 -87
  -166 -136 -794 -871 -1171 -1373 -1665 -2212 -2268 -4056 -1751 -5355 182
  -457 523 -869 974 -1176 555 -379 1250 -642 2165 -820 692 -134 1225 -205
  1655 -220 771 -26 1424 74 2030 312 163 64 467 216 605 302 543 342 956 795
  1236 1355 423 847 506 1853 239 2895 -114 445 -334 972 -585 1400 -497 846
  -1260 1631 -2159 2220 -244 159 -582 358 -753 441 -67 32 -67 33 -43 157 50
  262 128 478 417 1157 295 692 404 998 460 1300 30 157 32 413 4 515 -80 298
  -289 460 -681 530 -108 20 -428 27 -665 15z"/>
        </g>
      </svg>
      <LetterCountDiv
      onDrop={handleDragDrop} 
      onDragOver={handleDragOver} 
        onMouseLeave={() => { setMouseOver(false); }}
        onMouseOver={() => { setMouseOver(true); }}>{props.letters.length}
      </LetterCountDiv>
    </div>
  )
}

const LetterCountDiv = styled.div`
    color: #081313;
    position: relative;
    top: -42px;
    left: 26px;
    font-size: 18px;
    font-weight: bold;
    user-select: none;
`;