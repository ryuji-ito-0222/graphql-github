import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import client from './client';

const ME = gql`
  query me {
    user(login: "ryuji-ito-0222") {
      name
      avatarUrl
    }
  }
`;

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>Hello GraphQL</div>

      <Query query={ME}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error ${error.message}`;

          return (
            <div>
              {data.user.name}
              <img src={data.user.avatarUrl} alt="" />
            </div>
          );
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;
