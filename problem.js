"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProblem = void 0;
const postProblem = async () => {
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        const problemTitle = problem.title;
        const problemLink = problemOfTheDay.link;
        const res = {
            title: problemTitle,
            link: `https://leetcode.com${problemLink}`,
        };
        return res;
    }
    catch (error) {
        console.error("Error fetching problem:", error);
    }
};
exports.postProblem = postProblem;
