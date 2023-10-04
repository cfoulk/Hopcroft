export const postProblem = async () => {
    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
          query questionOfToday {
            activeDailyCodingChallengeQuestion {
              date
              userStatus
              link
              question {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                hasVideoSolution
                hasSolution
                topicTags {
                  name
                  id
                  slug
                }
              }
            }
          }
        `,
            }),
        });

        const data = await response.json();
        const problemOfTheDay = data.data.activeDailyCodingChallengeQuestion;
        const problem = problemOfTheDay.question;

        const problemTitle = problem.title as string;
        const problemLink = problemOfTheDay.link;
        const problemTags = problem.topicTags.map(tag => tag.name);


        type ret = {
            title: string;
            link: string;
            difficulty: string;
            tags: string[];
        };
        const res: ret = {
            title: problemTitle,
            link: `https://leetcode.com${problemLink}` as string,
            difficulty: problem.difficulty,
            tags: problemTags,
        };

        return res;
    } catch (error) {
        console.error('Error fetching problem:', error);
    }
};
