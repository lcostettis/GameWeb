document.addEventListener("DOMContentLoaded", () => {
  // Obtém os elementos HTML do formulário de configuração, tabuleiro do jogo e botão de reinício.
  const setupForm = document.getElementById("setup-form");
  const setupSection = document.getElementById("setup-section");
  const gameBoardSection = document.getElementById("game-board-section");
  const gameBoard = document.getElementById("game-board");
  const restartBtn = document.getElementById("restart-btn");

  // Define os temas disponíveis, cada um com pares de cartas (nome e imagem).
  const themes = {
      "mitologia": [
          { name: "Zeus", img: "⚡" },
          { name: "Atena", img: "🦉" },
          { name: "Poseidon", img: "🌊" },
          { name: "Hades", img: "🔥" }
      ],
      "herois": [
          { name: "Batman", img: "🦇"  },
          { name: "Superman", img: "🦸" },
          { name: "Mulher-Maravilha", img: "⭐" },
          { name: "Homem de Ferro", img: "🤖" }
      ]
  };

  // Variáveis para controle do jogo
  let firstCard = null; // Armazena a primeira carta clicada
  let secondCard = null; // Armazena a segunda carta clicada
  let flippedCards = 0; // Conta quantas cartas já foram combinadas

  // Evento de submissão do formulário para iniciar o jogo
  setupForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Impede o envio padrão do formulário
      const theme = document.getElementById("theme").value; // Obtém o tema selecionado no formulário
      startGame(theme); // Inicia o jogo com o tema escolhido
  });

  // Evento do botão de reinício para reiniciar o jogo
  restartBtn.addEventListener("click", () => {
      resetGame(); // Reseta o estado do jogo
  });

  /**
   * Função para iniciar o jogo
   * @param {string} theme - O tema escolhido pelo usuário
   */
  function startGame(theme) {
      resetGame(); // Reseta o estado anterior do jogo

      // Esconde o formulário de configuração e exibe a seção do jogo
      setupSection.classList.add("d-none");
      gameBoardSection.classList.remove("d-none");

      // Duplica o array de cartas e embaralha os pares
      const cardsArray = themes[theme].concat(themes[theme]);
      const shuffledCards = cardsArray.sort(() => 0.5 - Math.random());

      // Ajusta o tabuleiro para exibir as cartas em forma de grid
      gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(shuffledCards.length)}, 1fr)`;

      // Cria as cartas e adiciona ao tabuleiro
      shuffledCards.forEach(item => {
          const card = createCard(item); // Cria uma carta com base no item
          gameBoard.appendChild(card); // Adiciona a carta ao tabuleiro
      });
  }

  /**
   * Função para criar uma carta
   * @param {Object} item - Objeto contendo o nome e a imagem da carta
   * @returns {HTMLElement} - O elemento HTML da carta criada
   */
  function createCard(item) {
      // Cria o contêiner da carta
      const card = document.createElement("div");
      card.classList.add("card"); // Adiciona a classe 'card'
      card.dataset.name = item.name; // Define o nome como um atributo de dados

      // Cria o contêiner interno da carta (para efeito de flip)
      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner");

      // Cria a frente da carta (visível antes de virar)
      const cardFront = document.createElement("div");
      cardFront.classList.add("card-front");
      cardFront.textContent = "?"; // Mostra um ponto de interrogação inicialmente

      // Cria o verso da carta (com o ícone)
      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");
      cardBack.textContent = item.img; // Exibe o ícone correspondente

      // Monta a estrutura da carta
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      // Adiciona o evento de clique para a carta
      card.addEventListener("click", handleCardClick);

      return card; // Retorna a carta criada
  }

  /**
   * Função para tratar o clique em uma carta
   * @param {Event} e - Evento de clique
   */
  function handleCardClick(e) {
      const clickedCard = e.currentTarget; // Identifica a carta clicada

      // Ignora o clique se a carta já estiver virada ou se já houver duas cartas selecionadas
      if (clickedCard.classList.contains("flipped") || secondCard) return;

      // Adiciona a classe 'flipped' para exibir o verso da carta
      clickedCard.classList.add("flipped");

      // Define se é a primeira ou segunda carta a ser selecionada
      if (!firstCard) {
          firstCard = clickedCard; // Define a primeira carta
      } else {
          secondCard = clickedCard; // Define a segunda carta
          checkMatch(); // Verifica se as duas cartas combinam
      }
  }

  /**
   * Função para verificar se as duas cartas combinam
   */
  function checkMatch() {
      const isMatch = firstCard.dataset.name === secondCard.dataset.name; // Compara os nomes das cartas

      if (isMatch) {
          // Se for uma combinação, reinicia as variáveis e aumenta o contador de cartas combinadas
          firstCard = null;
          secondCard = null;
          flippedCards += 2;

          // Verifica se todas as cartas foram combinadas
          if (flippedCards === gameBoard.childElementCount) {
              setTimeout(() => alert("Parabéns, você venceu!"), 500); // Exibe mensagem de vitória
          }
      } else {
          // Se não for uma combinação, desvira as cartas após 1 segundo
          setTimeout(() => {
              firstCard.classList.remove("flipped");
              secondCard.classList.remove("flipped");
              firstCard = null;
              secondCard = null;
          }, 1000);
      }
  }

  /**
   * Função para resetar o estado do jogo
   */
  function resetGame() {
      gameBoard.innerHTML = ""; // Remove todas as cartas do tabuleiro
      firstCard = null; // Limpa a seleção da primeira carta
      secondCard = null; // Limpa a seleção da segunda carta
      flippedCards = 0; // Reseta o contador de cartas combinadas
  }
});
