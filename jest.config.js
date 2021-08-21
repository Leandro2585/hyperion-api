module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '@tests/(.+)': '<rootDir>/tests/$1',
    '@main/(.+)': '<rootDir>/src/main/$1',
    '@domain/(.+)': '<rootDir>/src/domain/$1',
    '@data/(.+)': '<rootDir>/src/data/$1',
    '@infra/(.+)': '<rootDir>/src/infra/$1',
    '@app/(.+)': '<rootDir>/src/app/$1'
  },
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  transform: {
    '\\.ts': 'ts-jest'
  },
  clearMocks: true
}
