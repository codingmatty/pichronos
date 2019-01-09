import Router from 'next/router';
import styled, { ThemeProvider } from 'styled-components';
import cron from 'cron';
import moment from 'moment';

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
const RefreshButtonWrapper = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 2rem;
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

function RefreshButton() {
  let onClick =
    typeof window === 'undefined'
      ? () => {}
      : () => Router.replace(window.location.href);
  return <RefreshButtonWrapper onClick={onClick}>Refresh</RefreshButtonWrapper>;
}

const defaultTheme = {
  backgroundColor: 'black',
  color: 'white'
};

export default class Display extends React.Component {
  static defaultProps = {
    shouldRefreshOnConfigChange: true
  };

  state = { time: null, theme: {} };

  timeCronJob = new cron.CronJob('* * * * * *', () => {
    this.setState({ time: moment() });
  });

  configCronJob = new cron.CronJob('0 * * * * *', () => {
    this.checkConfigHash();
  });

  componentDidMount() {
    const { shouldRefreshOnConfigChange } = this.props;
    this.timeCronJob.start();
    if (shouldRefreshOnConfigChange) {
      this.configCronJob.start();
    }
    this.setState({ theme: this.generateTheme() });
  }

  componentDidUpdate({ theme }) {
    const themePropsChanged = Object.keys(theme).some(
      (key) => theme[key] !== this.props.theme[key]
    );
    if (themePropsChanged) {
      this.setState({ theme: this.generateTheme() });
    }
  }

  componentWillUnmount() {
    this.timeCronJob.stop();
    this.configCronJob.stop();
  }

  checkConfigHash = async () => {
    const { hash } = this.props;
    const res = await fetch('/api/hash');
    const { hash: newHash } = await res.json();
    if (hash !== newHash) {
      Router.replace(window.location.href);
    }
  };

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
    const { time, theme } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <DisplayContainer>
          <Time time={time} />
          <RefreshButton />
        </DisplayContainer>
      </ThemeProvider>
    );
  }
}

Display.getInitialProps = async ({ req }) => {
  const urlPrefix = req ? `http://${req.headers.host}` : '';
  const themeRes = await fetch(`${urlPrefix}/api/theme`);
  const hashRes = await fetch(`${urlPrefix}/api/hash`);
  const { theme } = await themeRes.json();
  const { hash } = await hashRes.json();
  return { theme, hash };
};
