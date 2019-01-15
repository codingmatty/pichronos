import moment from 'moment';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import Display from '../components/Display';

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: relative;
`;
const DisplayWrapper = styled.div`
  height: 480px;
  width: 720px;
`;

export default class Config extends React.Component {
  state = {
    dirty: false,
    brightness: this.props.brightness,
    theme: this.props.theme
  };

  submitForm = (e) => {
    e.preventDefault();
    const { brightness, theme } = this.state;
    if (!isEqual(theme, this.props.theme)) {
      fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      });
    }
    if (brightness !== this.props.brightness) {
      fetch('/api/brightness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brightness })
      });
    }
  };

  render() {
    const { dirty, brightness, theme } = this.state;

    return (
      <ConfigContainer>
        <form onSubmit={this.submitForm}>
          <div>
            <label>Background Color:</label>
            <div>
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={({ target }) =>
                  this.setState(({ theme }) => ({
                    dirty: true,
                    theme: { ...theme, backgroundColor: target.value }
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label>Color:</label>
            <div>
              <input
                type="text"
                value={theme.color}
                onChange={({ target }) =>
                  this.setState(({ theme }) => ({
                    dirty: true,
                    theme: { ...theme, color: target.value }
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label>
              Brightness: {(((brightness - 50) / 205) * 100).toFixed(0)}%
            </label>
            <div>
              <input
                type="range"
                min="50"
                max="255"
                value={brightness}
                onChange={({ target }) =>
                  this.setState(() => ({
                    dirty: true,
                    brightness: target.value
                  }))
                }
              />
            </div>
          </div>
          <button disabled={!dirty}>Submit</button>
        </form>
        <h2>Display:</h2>
        <DisplayWrapper>
          <Display time={moment()} theme={theme} />
        </DisplayWrapper>
      </ConfigContainer>
    );
  }
}

Config.getInitialProps = async ({ req }) => {
  const urlPrefix = req ? `http://${req.headers.host}` : '';
  const res = await fetch(`${urlPrefix}/api/config`);
  const { config } = await res.json();
  return config;
};
