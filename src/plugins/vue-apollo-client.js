import { ApolloClient, from, HttpLink } from '@apollo/client'

import cache from "@/plugins/vue-apollo-cache.js"
import authLink from "@/plugins/vue-apollo-authLink.js"
import errorLink from "@/plugins/vue-apollo-errorLink.js"


const httpLink = new HttpLink({
    uri: "http://10.233.9.98:8000/graphql/",
    credentials: "include",
})

const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: cache,
})

export default apolloClient