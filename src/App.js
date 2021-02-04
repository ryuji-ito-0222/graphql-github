import { useState } from 'react';
import { Query } from 'react-apollo';
import { ME, SEARCH_REPOSITORIES } from './graphql';

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア',
};

const App = () => {
  const [value, setValue] = useState(VARIABLES);
  const { query, first, after, before, last } = value;
  return (
    <>
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
