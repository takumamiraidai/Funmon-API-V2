
import axios from 'axios';

async function generateText(env: any, prompt: string): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = env.API_KEY;

  // APIキーが設定されているか確認
  if (!apiKey) {
    throw new Error('API_KEY key is not set in environment variables.');
  }

  const maxTokens = 800; 

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt,
          }
        ],
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const assistantReply = response.data.choices[0].message.content;
    return assistantReply;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error:', (error as any).message);
    }
    throw new Error('Failed to communicate with OpenAI API.');
    return ''; 
  }
}

export default generateText;