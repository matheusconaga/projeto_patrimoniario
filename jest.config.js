export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^../api/firebase/firebase$': '<rootDir>/tests/mocks/firebase.js',
    '^@/api/firebase/firebase$': '<rootDir>/tests/mocks/firebase.js',
    '^firebase/app$': '<rootDir>/tests/mocks/firebase.js',
    '^firebase/auth$': '<rootDir>/tests/mocks/firebase.js',
    '^firebase/firestore$': '<rootDir>/tests/mocks/firebase.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        types: ['node', 'jest'],
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/api/firebase/firebase.ts',
    '!src/api/helper/helpersFirestore.ts',
    '!src/services/modelosService.ts',
  ],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.tsx',
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.spec.tsx',
  ],
  moduleDirectories: ['node_modules', 'src'],
};
