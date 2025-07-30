import styled from 'styled-components'
import ScrabbleLogo from './ScrabbleLogo'
import { useRef, useState } from 'react'
import { login } from '../util/utils'
import logo from './logo.png'
import { STYLES } from '../util/styles'
import { Button } from './Button'

export const LoginComponent = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const [usernameText, setUsernameText] = useState<string | undefined>(undefined)

  const logUserIn = () => {
    if (usernameText && usernameText !== '') {
      login(usernameText)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') logUserIn()
  }

  const handleOnChange = () => setUsernameText(usernameRef.current?.value)

  const isPlayButtonDisabled = usernameText === undefined || usernameText === ''

  return (
    <LoginMainDiv>
      <PlayerSelectContainer>
        <img className="logo" src={logo} alt="Logo" width={'300px'} />
        <TitleH2>Choose your username</TitleH2>
        <TextField
          ref={usernameRef}
          placeholder={'Insert username'}
          onKeyDown={handleKeyPress}
          onChange={handleOnChange}
        ></TextField>
        <Button onClick={logUserIn} isDisabled={isPlayButtonDisabled} text={'Play'} />
      </PlayerSelectContainer>
    </LoginMainDiv>
  )
}

const LoginMainDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin: 30px;
`

const TitleH2 = styled.h2`
  font-weight: normal;
  margin-top: 0px;
`

const TextField = styled.input`
  padding: 8px;
  border-radius: ${STYLES.BORDER_RADIUS_M};
  border: none;
  background: ${STYLES.INPUT_BG_COLOR};
  color: ${STYLES.INPUT_COLOR};
  text-align: center;
`

const PlayerSelectContainer = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding: 20px;
  max-width: 300px;
  border-radius: 8px;
  background: ${STYLES.BG_COLOR};
`
