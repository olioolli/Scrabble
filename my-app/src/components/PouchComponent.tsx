import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LetterTile } from '../../../scrabble-backend/server';

export type PouchComponentProps = {
  letters : LetterTile[];
  moveLetterToHandFromPouch : (letter: LetterTile) => Promise<void>;
}

export const PouchComponent = (props) => {

  const [isMouseOver, setMouseOver] = useState(false);

  const style = {
    width: "80px",
    height: "80px",
  };

  const handlePouchClicked = useCallback( async () => {
    if( props.letters.length <= 0 ) return;
    const idx = Math.floor((Math.random() * props.letters.length));
    await props.moveLetterToHandFromPouch(props.letters[idx]);
  },[props.letters]);

  const handleSvgMouseOver = useCallback ( () => {
    setMouseOver(true);
  }, []);

  const handleSvgMouseOut = useCallback( () => {
    setMouseOver(false);
  }, []);

  return (
    <div id={'pouch'} style= { { cursor: "pointer" } }>
      <svg onClick={ handlePouchClicked} onMouseLeave={ handleSvgMouseOut} onMouseOver={ handleSvgMouseOver } style={style} version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="924.000000pt" height="1280.000000pt" viewBox="0 0 924.000000 1280.000000"
        preserveAspectRatio="xMidYMid meet">
        <metadata>
          Created by potrace 1.15, written by Peter Selinger 2001-2017
        </metadata>
        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
          fill={isMouseOver ? "cyan" : "#eef1e3"} stroke="none">
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
      onClick={ handlePouchClicked}
      onMouseLeave={() => { setMouseOver(false); }} 
      onMouseOver={() => { setMouseOver(true); }}>{ props.letters.length}
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