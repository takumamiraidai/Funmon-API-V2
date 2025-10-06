import { Env } from '../types/env';
import axios from 'axios';

export class GPTService {
  constructor(private env: Env) {}

  async generateResponse(input: string): Promise<string> {
    const prompt = this.makePrompt(input);
    return await this.generateText(prompt);
  }

  private async generateText(prompt: string): Promise<string> {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = this.env.API_KEY;

    if (!apiKey) {
      throw new Error('API_KEY is not set in environment variables.');
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
            },
          ],
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      throw new Error('Failed to communicate with OpenAI API.');
    }
  }

  private makePrompt(input: string): string {
    return `
あなたは、公立はこだて未来大学の教員をおすすめするAIです。以下の質問に答えてください。
以下が教員とその専門分野の一覧です。
ユーザの入力に基づいて、おすすめの教員を7人選んでください。

渡邉 拓貴
ウェアラブルコンピューティング
ユビキタスコンピューティング
ヒューマンコンピュータインタラクション
行動認識

和田 雅昭
マリンIT
スマート水産業
IoT

ルースベン・スチュアート・ピーター
コミュニケーション

義永 那津人
ソフトマテリアルの非線形ダイナミックス
細胞生物の数理モデル
機械学習によるモデル推定

吉田 博則
アップサイクリング
建築デザイン
Human Computer Interaction
グラフィクス
計算製造学

山田 浩
プロジェクト学習、学習方略、英語教育、教員養成

山田 恭史
エコーロケーション
音響工学
数理生物学
動物行動学
バイオミメティクス

山内 翔
自律ロボット
機械学習

安井 重哉
製品のユーザーインタフェースデザイン

元木 環
情報デザイン
学術コンテンツ作成

村井 源
ディジタル・ヒューマニティーズ
計量文献学
物語論

迎山 和司
映像表現
コンピュータ・アート

宮本エジソン正
認知科学
言語処理

美馬 義亮
インタラクティブ・システム
芸術情報

美馬 のゆり
学習科学（情報工学、認知心理学、教育学）

三上 貞芳
知能機械学
松原 仁
人工知能
ゲーム情報学
公共交通
観光情報学

松原 克弥
システムソフトウェア
オペレーティングシステム
分散システム
ネットワークシステム
組み込みシステム
仮想化技術

フランク・イアン
AI
games
entertainment
education innovation
wayfinding

藤野 雄一
画像メディア処理
医療情報
遠隔医療

ユーザの入力：${input}
`;
  }
}
