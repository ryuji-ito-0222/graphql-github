import { useCallback, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from './graphql';

const PER_PAGE = 5;

const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア',
};

const StarButton = ({ node, query, first, after, before, last }) => {
  const StarStatus = ({ addOrRemoveStar }) => {
    return (
      <button
        type="button"
        onClick={() => {
          addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: (store, { data: { addStar, removeStar } }) => {
              const { starrable } = addStar || removeStar;
              console.log(starrable);
              const data = store.readQuery({
                query: SEARCH_REPOSITORIES,
                variables: { query, first, after, before, last },
              });
              const edges = data.search.edges;
              const newEdges = edges.map(edge => {
                if (edge.node.id === node.id) {
                  const { totalCount } = edge.node.stargazers;
                  const diff = starrable.viewerHasStarred ? -1 : 1;
                  const newTotalCount = totalCount + diff;
                  edge.node.stargazers.totalCount = newTotalCount;
                }
                return edge;
              });
              data.search.edges = newEdges;
              store.writeQuery({ query: SEARCH_REPOSITORIES, data });
            },
          });
        }}
      >
        {node.stargazers.totalCount} -{' '}
        {node.stargazers.totalCount === 1 ? 'star' : 'stars'} |{' '}
        {node.viewerHasStarred ? 'Yes' : 'No'}
      </button>
    );
  };
  return (
    <Mutation mutation={node.viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
      {addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} />}
    </Mutation>
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
                    <StarButton node={node} {...value} />
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
