const auth = {
  currentUser: null,

  onAuthStateChanged: jest.fn((callback) => {
    callback(auth.currentUser);
    return () => {};
  }),

  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};

const db = {
  collection: jest.fn(),
  doc: jest.fn(),

  _data: {},

  _resetData() {
    // Limpa o mesmo objeto em vez de substituí-lo.
    // Isso mantém referências como:
    // const mockData = db._data;
    Object.keys(this._data).forEach((key) => {
      delete this._data[key];
    });
  },
};

/**
 * =========================
 * Firebase Auth
 * =========================
 */

const getAuth = jest.fn(() => auth);

const createUserWithEmailAndPassword = jest.fn(
  (...args) => auth.createUserWithEmailAndPassword(...args)
);

const signInWithEmailAndPassword = jest.fn(
  (...args) => auth.signInWithEmailAndPassword(...args)
);

const signOut = jest.fn(
  (...args) => auth.signOut(...args)
);

/**
 * =========================
 * Firestore
 * =========================
 */

const getFirestore = jest.fn(() => db);

const doc = jest.fn((database, collectionPath, docId) => {
  return {
    id: docId,
    path: `${collectionPath}/${docId}`,
  };
});

const collection = jest.fn((database, collectionPath) => {
  return {
    path: collectionPath,
  };
});

const setDoc = jest.fn((ref, data) => {
  if (ref && ref.path) {
    const [collectionName, id] = ref.path.split('/');

    if (!db._data[collectionName]) {
      db._data[collectionName] = {};
    }

    db._data[collectionName][id] = data;
  }

  return Promise.resolve();
});

const getDoc = jest.fn((ref) => {
  if (ref && ref.path) {
    const [collectionName, id] = ref.path.split('/');

    const data = db._data[collectionName]?.[id];

    return Promise.resolve({
      exists: () => !!data,
      data: () => data,
      id,
    });
  }

  return Promise.resolve({
    exists: () => false,
    data: () => undefined,
  });
});

const getDocs = jest.fn((collectionRef) => {
  const collectionPath = collectionRef.path;

  const collectionData = db._data[collectionPath] || {};

  const docs = Object.entries(collectionData).map(([id, data]) => ({
    id,
    data: () => data,
    exists: () => true,
  }));

  return Promise.resolve({
    docs,
  });
});

const updateDoc = jest.fn((ref, updates) => {
  if (ref && ref.path) {
    const [collectionName, id] = ref.path.split('/');

    if (
      db._data[collectionName] &&
      db._data[collectionName][id]
    ) {
      db._data[collectionName][id] = {
        ...db._data[collectionName][id],
        ...updates,
      };
    }
  }

  return Promise.resolve();
});

const deleteDoc = jest.fn((ref) => {
  if (ref && ref.path) {
    const [collectionName, id] = ref.path.split('/');

    if (db._data[collectionName]) {
      delete db._data[collectionName][id];
    }
  }

  return Promise.resolve();
});

/**
 * =========================
 * Timestamp
 * =========================
 */

class Timestamp {
  constructor(seconds, nanoseconds) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate() {
    return new Date(this.seconds * 1000);
  }

  static fromDate(date) {
    return new Timestamp(
      Math.floor(date.getTime() / 1000),
      0
    );
  }

  static now() {
    return new Timestamp(
      Math.floor(Date.now() / 1000),
      0
    );
  }
}

const serverTimestamp = jest.fn(() => Timestamp.now());

/**
 * =========================
 * Reset
 * =========================
 */

const _resetData = () => {
  db._resetData();
  auth.currentUser = null;
};

/**
 * =========================
 * Exports
 * =========================
 */

module.exports = {
  // Auth
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,

  // Firestore
  db,
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,

  // Timestamp
  Timestamp,
  serverTimestamp,

  // Test helpers
  _resetData,
};
