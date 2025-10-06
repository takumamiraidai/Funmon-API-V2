import { makePrompt } from "./makePrompt";
import generateText from "./generateText";

export const botRequest = async (env: any, input: string): Promise<string | null> => {
	try {
        console.log('Input:', input);

		const question = 
		`ユーザの入力：${input}`;

        var prompt = null;

		prompt = makePrompt(input);

        var answer = null;
        if(prompt != null){
            answer = await generateText(env, prompt);
        }

        console.log('チャットボットの返答:', answer);
		return answer;

	} catch (error) {
		console.error("Error occurred:", error);
		return "Catch error"; 
	}
};