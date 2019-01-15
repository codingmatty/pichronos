import Router from 'next/router';
import styled, { ThemeProvider } from 'styled-components';

const DisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.color};
  position: relative;
`;
const TimeWrapper = styled.div`
  font-size: 9rem;
`;
const TimeSecondsWrapper = styled.span`
  font-size: 0.6em;
`;

function Time({ time }) {
  if (!time) {
    return <TimeWrapper>Loading...</TimeWrapper>;
  }

  return (
    <TimeWrapper>
      {time.format('h:mm')}
      <TimeSecondsWrapper>{time.format(':ss A')}</TimeSecondsWrapper>
    </TimeWrapper>
  );
}

const defaultTheme = {
  backgroundColor: 'black',
  color: 'white'
};

export default class Display extends React.PureComponent {
  generateTheme = () => {
    const { theme } = this.props;

    const generatedTheme = { ...defaultTheme };
    Object.keys(theme).forEach((key) => {
      if (theme[key]) {
        generatedTheme[key] = theme[key];
      }
    });

    return generatedTheme;
  };

  render() {
    const { time } = this.props;

    const theme = this.generateTheme();

    return (
      <ThemeProvider theme={theme}>
        <DisplayContainer>
          <Time time={time} />
        </DisplayContainer>
      </ThemeProvider>
    );
  }
}
