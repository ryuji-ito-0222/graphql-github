import { Query } from 'react-apollo';
import { ME } from './graphql';

const App = () => {
  return (
    <>
      <div>Hello GraphQL</div>

      <Query query={ME}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error ${error.message}`;

          return (
            <div>
              {data.user.name}
              <img src={data.user.avatarUrl} alt="私のロゴ画像" width={100} />
            </div>
          );
        }}
      </Query>
    </>
  );
};

export default App;
