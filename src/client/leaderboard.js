import escape from 'lodash/escape';

const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard li');

export function updateLeaderboard(data) {
  // string escape
  for (let i = 0; i < data.length; i++) {
    rows[i].innerHTML = `<mark>${escape(data[i].username.slice(0, 12)) || 'Anonymous' + data.length }</mark><small>${
      data[i].score
    }</small>`;
  }
  // befüllen des rankings
  for (let i = data.length; i < 5; i++) {
    rows[i].innerHTML = '<mark></mark><small>?</small>';
  }
}

// ausblenden in start screen -> anzeigen im game
export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
