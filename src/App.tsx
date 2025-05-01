import { useState } from 'react'
import './App.css'
import { ITEMS } from './variables'
function App() {
  const [items] = useState<string[]>(ITEMS);
  const [randomItem, setRandomItem] = useState<string>('');

  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setRandomItem(items[randomIndex]);
  };
  

  return (
    <>
      <div>
      </div>
      <h1>Buckshoot Randomizer</h1>
      <div className="card">
      <h2>Рандомайзер Предметов</h2>
      <button onClick={getRandomItem}>Получить случайный предмет</button>
      {randomItem && <p>Результат: {randomItem}</p>}
      </div>
      <p className="read-the-docs">
        Я сделал это дерьмо за 15 мин
      </p>
    </>
  )
}

export default App
