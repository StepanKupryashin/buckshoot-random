import { useState } from 'react'
import './App.css'
import { ITEMS, EXCLUDED_ITEMS_ROUND_2 } from './variables'


interface HistoryEntry {
  round: number;
  playerCount: number;
  results: {player: number, items: string[]}[];
  timestamp: Date;
}

function App() {
  const [items] = useState<string[]>(ITEMS);
  const [round, setRound] = useState<number>(1);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [results, setResults] = useState<{player: number, items: string[]}[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const getFilteredItems = () => {
    if (round === 2) {
      return items.filter(item => !EXCLUDED_ITEMS_ROUND_2.includes(item));
    }
    return [...items];
  };

  const generateItems = () => {
    if (round === 1) {
      setResults([]);
      addToHistory([]);
      return;
    }

    const itemsPerPlayer = round === 2 ? 2 : 4;
    const availableItems = getFilteredItems();
    const shuffledItems = [...availableItems].sort(() => Math.random() - 0.5);
    let itemIndex = 0;

    const newResults = [];
    for (let player = 1; player <= playerCount; player++) {
      const playerItems = [];
      for (let i = 0; i < itemsPerPlayer; i++) {
        if (itemIndex >= shuffledItems.length) {
          itemIndex = 0;
        }
        playerItems.push(shuffledItems[itemIndex]);
        itemIndex++;
      }
      newResults.push({ player, items: playerItems });
    }

    setResults(newResults);
    addToHistory(newResults);
  };

  const addToHistory = (currentResults: {player: number, items: string[]}[]) => {
    const historyEntry: HistoryEntry = {
      round,
      playerCount,
      results: [...currentResults],
      timestamp: new Date()
    };
    setHistory(prev => [historyEntry, ...prev]);
  };

  const handleRoundChange = (newRound: number) => {
    setRound(newRound);
    setResults([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Buckshoot Randomizer</h1>
      </header>
      
      <main className="main-content">
        <div className="card">
          <h2>Рандомайзер Предметов</h2>
          
          <div className="controls">
            <div className="control-group">
              <label>Раунд:</label>
              <div className="round-buttons">
                {[1, 2, 3].map(r => (
                  <button 
                    key={r} 
                    onClick={() => handleRoundChange(r)}
                    className={round === r ? 'active' : ''}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="control-group">
              <label htmlFor="playerCount">Количество игроков:</label>
              <input 
                id="playerCount"
                type="number" 
                min="2" 
                value={playerCount}
                onChange={(e) => setPlayerCount(Math.max(2, parseInt(e.target.value)))}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={generateItems}
              className="generate-btn"
            >
              {round === 1 ? 'Пропустить первый раунд' : `Сгенерировать (${round === 2 ? '2' : '4'} на игрока)`}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="history-toggle"
            >
              {showHistory ? '▲ Скрыть' : '▼ История'}
            </button>
          </div>

          {round === 1 && results.length === 0 && (
            <p className="round-info">Первый раунд - предметы не выдаются</p>
          )}

          {round === 2 && (
            <p className="excluded-notice">
              Исключены: {EXCLUDED_ITEMS_ROUND_2.join(', ')}
            </p>
          )}

          {results.length > 0 && (
            <div className="results">
              <h3>Раунд {round}:</h3>
              <div className="player-results-grid">
                {results.map((result, index) => (
                  <div key={index} className="player-result-card">
                    <h4>Игрок {result.player}</h4>
                    <ul>
                      {result.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showHistory && (
            <div className="history-panel">
              <h3>История</h3>
              {history.length === 0 ? (
                <p className="empty-history">Нет данных</p>
              ) : (
                <div className="history-entries">
                  {history.map((entry, index) => (
                    <div key={index} className="history-entry">
                      <div className="history-header">
                        <span className="round-badge">Раунд {entry.round}</span>
                        <span className="players-count">{entry.playerCount} игроков</span>
                        <span className="time">{formatTime(entry.timestamp)}</span>
                      </div>
                      {entry.results.length > 0 ? (
                        <div className="history-results">
                          {entry.results.map((result, i) => (
                            <div key={i} className="history-player-result">
                              <span>Игрок {result.player}:</span>
                              <span className="items">{result.items.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-items">Предметы не выдавались</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Я сделал это дерьмо за 15 мин (и потом доработал)</p>
      </footer>
    </div>
  )
}

export default App