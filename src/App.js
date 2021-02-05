import { useCallback, useState } from 'react';
import { Query } from 'react-apollo';
import { SEARCH_REPOSITORIES } from './graphql';

const PER_PAGE = 5;

const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア',
};

const StarButton = ({ node }) => {
  return (
    <button type="button">
      {node.stargazers.totalCount} -{' '}
      {node.stargazers.totalCount === 1 ? 'star' : 'stars'}
    </button>
  );
};

const App = () => {
  const [value, setValue] = useState(DEFAULT_STATE);
  const { query, first, after, before, last } = value;

  const handleChange = useCallback(e => {
    setValue({ ...DEFAULT_STATE, query: e.target.value });
  }, []);

  const goNext = search => {
    setValue({
      ...DEFAULT_STATE,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
    });
  };
  const goPrevious = search => {
    setValue({
      ...DEFAULT_STATE,
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
    });
  };

  console.log(query);

  return (
    <>
      <form>
        <input type="text" value={query} onChange={handleChange} />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ query, first, after, before, last }}
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error ${error.message}`;
          console.log(data.search);
          return (
            <>
              <h2>
                GitHub Repositories Search Results -{' '}
                {data.search.repositoryCount}
                {data.search.repositoryCount === 1
                  ? 'Repository'
                  : 'Repositories'}
              </h2>
              <ul>
                {data.search.edges.map(({ node }) => (
                  <li key={node.id}>
                    <a
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {node.name}
                    </a>
                    &nbsp;
                    <StarButton node={node} />
                  </li>
                ))}
              </ul>
              {data.search.pageInfo.hasPreviousPage && (
                <button type="button" onClick={() => goPrevious(data.search)}>
                  Previous
                </button>
              )}
              {data.search.pageInfo.hasNextPage && (
                <button type="button" onClick={() => goNext(data.search)}>
                  Next
                </button>
              )}
            </>
          );
        }}
      </Query>
    </>
  );
};

export default App;
