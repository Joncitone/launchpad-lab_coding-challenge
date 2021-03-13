import FrameworkAPI from '../api/github.js';
import store from './index.js';

//API
const emberAPI = new FrameworkAPI('emberjs', 'ember.js');

//ACTION TYPES
const GET_EMBER_SCORE = 'GET_EMBER_SCORE';
const GET_EMBER_FORKS = 'GET_EMBER_FORKS';
const GET_EMBER_COMMITS = 'GET_EMBER_COMMITS';
const GET_EMBER_ISSUES_CLOSED = 'GET_EMBER_ISSUES_CLOSED';

//ACTION CREATORS
const getEmberScore = (score) => ({ type: GET_EMBER_SCORE, score });
const getEmberForks = (forks) => ({ type: GET_EMBER_FORKS, forks });
const getEmberCommits = (commits) => ({ type: GET_EMBER_COMMITS, commits });
const getEmberIssuesClosed = (issuesClosed) => ({
  type: GET_EMBER_ISSUES_CLOSED,
  issuesClosed,
});

//THUNKS
export function getEmberScoreThunk() {
  const score =
    Math.floor(store.state.ember.forks / 10000) +
    Math.floor(store.state.ember.commits / 100) +
    Math.floor(store.state.ember.issuesClosed / 1000);

  store.dispatch(getEmberScore(score));
}

export function getEmberForksThunk() {
  emberAPI
    .fetchForks()
    .then((response) => response.json())
    .then((data) => {
      store.dispatch(getEmberForks(data.items[0].forks));
    })
    .catch((error) => console.error(error));
}

export const getEmberCommitsThunk = () => {
  emberAPI
    .fetchCommits()
    .then((response) => response.json())
    .then((data) => {
      let commits = data.all.reduce((acc, curr) => acc + curr, 0);
      store.dispatch(getEmberCommits(commits));
    })
    .catch((error) => console.error(error));
};

export const getEmberIssuesClosedThunk = () => {
  emberAPI
    .fetchIssuesClosed()
    .then((response) => response.json())
    .then((data) => {
      store.dispatch(getEmberIssuesClosed(data.total_count));
    })
    .catch((error) => console.error(error));
};

//INITIAL STATE
const initialState = {
  name: 'ember',
  score: 0,
  forks: 0,
  commits: 0,
  issuesClosed: 0,
};

//REDUCER
export default function ember(state = initialState, action) {
  switch (action.type) {
    case GET_EMBER_SCORE:
      return { ...state, score: action.score };
    case GET_EMBER_FORKS:
      return { ...state, forks: action.forks };
    case GET_EMBER_COMMITS:
      return { ...state, commits: action.commits };
    case GET_EMBER_ISSUES_CLOSED:
      return { ...state, issuesClosed: action.issuesClosed };

    default:
      return state;
  }
}
