module.exports = {
    redirects: async () => (
        [
            {
                source: '/github',
                destination: 'https://github.com/LeanneStoDomingo/testudo-tracker',
                permanent: true,
            },
            {
                source: '/reddit',
                destination: 'https://www.reddit.com/user/testudo-tracker',
                permanent: true,
            },
        ]
    )
}
