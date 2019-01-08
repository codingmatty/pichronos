import Router from 'next/router';
import styled from 'styled-components';
import cron from 'cron';
import moment from 'moment';

const DisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: black;
  color: white;
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

export default class Display extends React.Component {
  state = { time: null };

  componentDidMount() {
    this.cronJob = new cron.CronJob('* * * * * *', () => {
      this.setState({ time: moment() });
    });
    this.cronJob.start();
  }

  componentWillUnmount() {
    this.cronJob.stop();
  }

  render() {
    return (
      <DisplayContainer>
        <Time />
        <RefreshButton />
      </DisplayContainer>
    );
  }
}
