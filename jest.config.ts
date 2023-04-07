// const nextJest = require('next/jest')
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: '.' })

const customJestConfig = {
	testEnvironment: 'jsdom',
	clearMocks: true,
	moduleDirectories: ['node_modules', 'components'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.jest.json',
		},
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
}

export default createJestConfig(customJestConfig)
