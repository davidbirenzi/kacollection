import fs from "fs";
import path from "path";
import type {
  CategoryRow,
  ContactMessageRow,
  OrderItemRow,
  OrderRow,
  ProductRow,
  ReviewRow,
  UserRow,
} from "./types";

export type StoreData = {
  users: UserRow[];
  categories: CategoryRow[];
  products: ProductRow[];
  orders: OrderRow[];
  orderItems: OrderItemRow[];
  reviews: ReviewRow[];
  messages: ContactMessageRow[];
};

const storePath = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "data",
  "store.json"
);

const emptyStore = (): StoreData => ({
  users: [],
  categories: [],
  products: [],
  orders: [],
  orderItems: [],
  reviews: [],
  messages: [],
});

const globalForStore = globalThis as unknown as {
  kacollectionStore?: StoreData;
};

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function readStore(): StoreData {
  if (isBuildPhase()) return emptyStore();

  if (globalForStore.kacollectionStore) {
    return globalForStore.kacollectionStore;
  }

  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  if (!fs.existsSync(storePath)) {
    const data = emptyStore();
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
    globalForStore.kacollectionStore = data;
    return data;
  }

  const data = JSON.parse(fs.readFileSync(storePath, "utf8")) as StoreData;
  globalForStore.kacollectionStore = data;
  return data;
}

export function writeStore(data: StoreData) {
  if (isBuildPhase()) return;
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
  globalForStore.kacollectionStore = data;
}

export function updateStore(mutator: (data: StoreData) => void) {
  const data = readStore();
  mutator(data);
  writeStore(data);
  return data;
}

export function createId() {
  return crypto.randomUUID();
}
