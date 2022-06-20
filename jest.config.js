module.exports = {
    roots : [
        '<rootDir>/',
    ],
    verbose         : true,

    testEnvironment : 'node',

    globals : {
        'ts-jest' : {
            'tsconfig' : 'tsconfig.json',
        },
    },

    moduleFileExtensions : ['js', 'ts'],

    transform : {
        '^.+\\.ts$'  : 'ts-jest',
    },

    testPathIgnorePatterns : ['/node_modules/', '/dist/'],
};
