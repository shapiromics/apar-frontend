import { InMemoryCache } from "@apollo/client";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

export default cache;
