/// <reference types="react" />
import * as React from 'react';
import ApolloClient from 'apollo-client';
export interface ApolloConsumerProps {
    children: (client: ApolloClient<any>) => React.ReactElement<any> | null;
}
declare const ApolloConsumer: React.StatelessComponent<ApolloConsumerProps>;
export default ApolloConsumer;
