import Router from 'next/router';
import cron from 'cron';
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import { CONFIG_CHANGED } from '../common/socket-events';
import Display from '../components/Display';

export default class DisplayPage extends React.Component {
  state = { time: null, theme: this.props.theme };

  socket = socketIOClient('http://127.0.0.1:8080');

  timeCronJob = new cron.CronJob('* * * * * *', () => {
    this.setState({ time: moment() });
  });

  componentDidMount() {
    this.timeCronJob.start();
    this.socket.on(CONFIG_CHANGED, this.configChanged);
  }

  componentWillUnmount() {
    this.timeCronJob.stop();
    this.socket.close();
  }

  configChanged = ({ theme }) => {
    this.setState({ theme });
  };

  render() {
    const { time, theme } = this.state;

    return <Display time={time} theme={theme} />;
  }
}

DisplayPage.getInitialProps = async ({ req }) => {
  const urlPrefix = req ? `http://${req.headers.host}` : '';
  const themeRes = await fetch(`${urlPrefix}/api/theme`);
  const { theme } = await themeRes.json();
  return { theme };
};
