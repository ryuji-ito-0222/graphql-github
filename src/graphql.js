import { gql } from 'apollo-boost';

export const ME = gql`
  query me {
    user(login: "ryuji-ito-0222") {
      name
      avatarUrl
    }
  }
`;
