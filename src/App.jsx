import React, { useState, useEffect } from 'react';

const App = () => {
  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const hours = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  // Função para carregar as tarefas do LocalStorage
  const loadInitialState = () => {
    const savedTasks = localStorage.getItem('taskStatus');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } else {
      // Se não houver tarefas salvas, cria um estado inicial vazio
      return daysOfWeek.reduce((acc, day) => {
        acc[day] = hours.reduce((hAcc, hour) => {
          hAcc[hour] = { status: 0, task: '' }; // Inicialmente todos os horários têm status 0 e tarefa vazia
          return hAcc;
        }, {});
        return acc;
      }, {});
    }
  };

  // Estado inicial, carrega do LocalStorage ou cria um novo
  const [taskStatus, setTaskStatus] = useState(loadInitialState);

  // Função para salvar no LocalStorage sempre que o taskStatus mudar
  useEffect(() => {
    localStorage.setItem('taskStatus', JSON.stringify(taskStatus));
  }, [taskStatus]); // O useEffect é acionado toda vez que o taskStatus muda

  // Função que lida com o clique e troca o status de 0 (branco) -> 1 (amarelo) -> 2 (verde) -> 0 (branco)
  const handleClick = (day, hour) => {
    setTaskStatus((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: {
          ...prev[day][hour],
          status: (prev[day][hour].status + 1) % 3, // Alterna entre 0, 1 e 2
        },
      },
    }));
  };

  // Função que lida com a atualização da tarefa
  const handleTaskChange = (day, hour, task) => {
    setTaskStatus((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: {
          ...prev[day][hour],
          task: task, // Atualiza a tarefa
        },
      },
    }));
  };

  // Função que retorna a cor de fundo baseada no status
  const getBackgroundColor = (status) => {
    switch (status) {
      case 0:
        return 'white';   // A fazer
      case 1:
        return 'yellow';  // Quase se atrasando
      case 2:
        return 'green';   // Pronto
      default:
        return 'white';
    }
  };

  return (
    <div className="rotine">
      {daysOfWeek.map((day) => (
        <div key={day} className="day-column">
          <h3>{day}</h3>
          {hours.map((hour) => (
            <div
              key={hour}
              onClick={() => handleClick(day, hour)} // O clique muda a cor do bloco
              className="task-box" // Adiciona a classe aqui
              style={{
                backgroundColor: getBackgroundColor(taskStatus[day][hour].status),
              }}
            >
              <span>{hour}</span>
              <input
                type="text"
                value={taskStatus[day][hour].task}
                onClick={(e) => e.stopPropagation()} // Impede que o clique no input altere a cor
                onChange={(e) => handleTaskChange(day, hour, e.target.value)}
                placeholder="Tarefa"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
}
export default App;
