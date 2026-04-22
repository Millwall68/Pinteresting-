(function() {
  function initDotDash() {
    var arena = document.getElementById('arena');
    var dot = document.getElementById('dot');
    var startButton = document.getElementById('start-game');
    var scoreNode = document.getElementById('score');
    var timeNode = document.getElementById('time-left');
    var statusNode = document.getElementById('status');

    if (!arena || !dot || !startButton || !scoreNode || !timeNode || !statusNode) {
      return;
    }

    var score = 0;
    var timeLeft = 20;
    var gameTimer = null;
    var playing = false;

    function randomPosition(limit) {
      return Math.floor(Math.random() * limit);
    }

    function moveDot() {
      var maxX = arena.clientWidth - dot.offsetWidth;
      var maxY = arena.clientHeight - dot.offsetHeight;
      dot.style.left = randomPosition(maxX) + 'px';
      dot.style.top = randomPosition(maxY) + 'px';
    }

    function stopGame() {
      playing = false;
      clearInterval(gameTimer);
      gameTimer = null;
      dot.disabled = true;
      statusNode.textContent = 'Time! Final score: ' + score + '. Hit start to play again.';
      startButton.disabled = false;
    }

    function tick() {
      timeLeft -= 1;
      timeNode.textContent = timeLeft;

      if (timeLeft <= 0) {
        stopGame();
      }
    }

    function startGame() {
      score = 0;
      timeLeft = 20;
      playing = true;

      scoreNode.textContent = score;
      timeNode.textContent = timeLeft;
      statusNode.textContent = 'Go! Click fast.';
      dot.disabled = false;
      startButton.disabled = true;

      moveDot();
      clearInterval(gameTimer);
      gameTimer = setInterval(tick, 1000);
    }

    dot.addEventListener('click', function() {
      if (!playing) {
        return;
      }

      score += 1;
      scoreNode.textContent = score;
      moveDot();
    });

    startButton.addEventListener('click', startGame);

    dot.disabled = true;
    moveDot();
  }

  document.addEventListener('DOMContentLoaded', initDotDash);
  document.addEventListener('turbolinks:load', initDotDash);
})();
