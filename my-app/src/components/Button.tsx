import styled from 'styled-components'
import { STYLES } from '../util/styles'
import { FC } from 'react'

type Props = {
  onClick: () => void
  isDisabled: boolean
  text: string
  variant?: 'small'
}

export const Button: FC<Props> = ({ onClick, isDisabled, text, variant }) => {
  return (
    <StyledButton onClick={onClick} isDisabled={isDisabled} variant={variant}>
      {text}
    </StyledButton>
  )
}

const StyledButton = styled.button`
    padding: ${(props) => (props.variant === 'small' ? '5px' : '15px;')};
    margin-top: 20px;
    width: 150px;
    border-radius:  ${(props) => (props.variant === 'small' ? '5px' : '25px;')};
    background: ${STYLES.BUTTON_BG_COLOR};
    color: ${STYLES.BUTTON_COLOR};
    font-size: 14px;
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
    border: none;
    font-weight: ${(props) => (props.variant === 'small' ? '400' : '700;')};
    opacity: ${(props) => (props.isDisabled ? '0.5' : '1')};

    &:hover {
        background: ${(props) => (props.isDisabled ? STYLES.BUTTON_BG_COLOR : STYLES.BUTTON_COLOR)};
        color: ${(props) => (props.isDisabled ? STYLES.BUTTON_COLOR : STYLES.BG_COLOR)};
    }
}
`
