import moment from 'moment';
import styled from 'styled-components';
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
  state = { theme: this.props.theme };

  submitForm = (e) => {
    e.preventDefault();
    const { theme } = this.state;
    fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });
  };

  render() {
    const { theme } = this.state;

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
                    theme: { ...theme, color: target.value }
                  }))
                }
              />
            </div>
          </div>
          <button>Submit</button>
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
  const res = await fetch(`${urlPrefix}/api/theme`);
  const { theme } = await res.json();
  return { theme };
};
