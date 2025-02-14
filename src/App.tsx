import { Game } from './game/components/Game';

function App() {
  return (
    <div className="app-container">
      <div className="game-header">
        <h1 className="game-title">赛博土拨鼠大战</h1>
      </div>
      
      <div className="game-layout">
        <div className="game-sidebar">
          <div className="game-instructions">
            <p>游戏说明：</p>
            <ul>
              <li>点击"开始"按钮开始游戏</li>
              <li>点击移动的地鼠得分</li>
              <li>连续击中可以累积连击数</li>
              <li>点击空白处会被记为失误</li>
            </ul>
          </div>
        </div>
        
        <div className="game-main">
          <Game />
        </div>
      </div>
    </div>
  );
}

export default App;
