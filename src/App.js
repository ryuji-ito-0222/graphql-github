import { useCallback, useState } from 'react';
import { Query } from 'react-apollo';
import { ME, SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア',
};

const App = () => {
  const [value, setValue] = useState(DEFAULT_STATE);
  const { query, first, after, before, last } = value;
  const handleChange = useCallback(e => {
    setValue({ ...DEFAULT_STATE, query: e.target.value });
  }, []);
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
          console.log(data);
          return <div></div>;
        }}
      </Query>
    </>
  );
};

export default App;
