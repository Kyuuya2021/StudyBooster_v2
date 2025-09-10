import { NextRequest, NextResponse } from 'next/server';
import { config, validateEnvironment } from '@/lib/config';

// 環境変数の検証
try {
  validateEnvironment();
} catch (error) {
  console.warn('Environment validation warning:', error);
}

// 画像解析用のプロンプト
const ANALYSIS_PROMPT = `
あなたは優秀な数学・理科・英語の家庭教師です。画像に写っている問題を分析し、以下の形式でJSONを返してください。

{
  "subject": "科目名（数学、物理、化学、生物、英語など）",
  "topic": "具体的なトピック（例：二次方程式、力学、有機化学など）",
  "difficulty": "難易度（初級、中級、上級）",
  "question": "問題文を正確に抽出",
  "answer": "最終的な答え",
  "explanation": "詳細な解説（段階的に説明）",
  "steps": [
    {
      "step": 1,
      "description": "ステップの説明",
      "equation": "数式や計算過程"
    }
  ],
  "relatedConcepts": ["関連する概念1", "関連する概念2"],
  "confidence": 0.95,
  "application": {
    "title": "実生活での応用例のタイトル",
    "description": "応用例の詳細説明"
  },
  "quiz": [
    {
      "question": "関連するクイズ問題",
      "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "correct": "A",
      "explanation": "正解の理由"
    }
  ]
}

注意事項：
- 画像が数学問題の場合は、計算過程を詳しく説明してください
- 画像が理科問題の場合は、物理法則や化学反応を説明してください
- 画像が英語問題の場合は、文法や語彙を説明してください
- 必ずJSON形式で返してください
- 日本語で回答してください
`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: '画像データが提供されていません' },
        { status: 400 }
      );
    }

    if (!config.api.openai.apiKey) {
      console.warn('OpenAI API key not found, using mock data');
      return getMockResult(startTime, image);
    }

    // OpenAI GPT-4 Vision APIを呼び出し
    const openaiResponse = await fetch(`${config.api.openai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.api.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.api.openai.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: ANALYSIS_PROMPT
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: config.api.openai.maxTokens,
        temperature: config.api.openai.temperature
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI API returned empty response');
    }

    // JSONレスポンスをパース
    let analysis;
    try {
      // JSON部分を抽出（```json で囲まれている場合がある）
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysis = JSON.parse(jsonString);
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('AI response parsing failed');
    }

    const processingTime = Date.now() - startTime;

    const result = {
      success: true,
      analysis: {
        subject: analysis.subject || '数学',
        topic: analysis.topic || '一般問題',
        difficulty: analysis.difficulty || '中級',
        question: analysis.question || '問題を読み取れませんでした',
        answer: analysis.answer || '解析できませんでした',
        explanation: analysis.explanation || '詳細な解説を生成できませんでした',
        steps: analysis.steps || [],
        relatedConcepts: analysis.relatedConcepts || [],
        confidence: analysis.confidence || 0.8,
        application: analysis.application || {
          title: '実生活での応用',
          description: 'この問題で学んだ内容は、実生活の様々な場面で応用できます。'
        },
        quiz: analysis.quiz || []
      },
      metadata: {
        processingTime: processingTime,
        timestamp: new Date().toISOString(),
        imageSize: image.length,
        aiModel: config.api.openai.model
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // エラーが発生した場合は、フォールバックとしてモックデータを返す
    const processingTime = Date.now() - startTime;
    return getMockResult(processingTime, '');
  }
}

// モックデータ生成関数（APIキーがない場合やエラー時のフォールバック）
function getMockResult(processingTime: number, image: string) {
  const mockResult = {
    success: true,
    analysis: {
      subject: '数学',
      topic: '二次方程式',
      difficulty: '中級',
      question: 'x² - 5x + 6 = 0 を解け',
      answer: 'x = 2, 3',
      explanation: 'この二次方程式は因数分解で解くことができます。\n\nx² - 5x + 6 = 0\n(x - 2)(x - 3) = 0\n\nしたがって、x = 2 または x = 3 が解となります。',
      steps: [
        {
          step: 1,
          description: '二次方程式を因数分解の形に変形する',
          equation: 'x² - 5x + 6 = (x - 2)(x - 3)'
        },
        {
          step: 2,
          description: '因数分解した式を0とおく',
          equation: '(x - 2)(x - 3) = 0'
        },
        {
          step: 3,
          description: '各因数を0とおいて解を求める',
          equation: 'x - 2 = 0 または x - 3 = 0'
        },
        {
          step: 4,
          description: '解を計算する',
          equation: 'x = 2 または x = 3'
        }
      ],
      relatedConcepts: [
        '因数分解',
        '二次方程式の解の公式',
        '判別式'
      ],
      confidence: 0.95,
      application: {
        title: 'ロケットの軌道計算への応用',
        description: '二次方程式は、ロケットの軌道計算や衛星の軌道設計において重要な役割を果たします。実際の宇宙開発では、このような数学的計算が基盤となっています。'
      },
      quiz: [
        {
          question: '二次方程式 x² - 7x + 12 = 0 の解は？',
          options: ['x = 3, 4', 'x = 2, 5', 'x = 1, 6', 'x = 0, 7'],
          correct: 'A',
          explanation: '因数分解すると (x - 3)(x - 4) = 0 となり、x = 3, 4 が解です。'
        }
      ]
    },
    metadata: {
      processingTime: processingTime,
      timestamp: new Date().toISOString(),
      imageSize: image.length,
      aiModel: 'mock-data'
    }
  };

  return NextResponse.json(mockResult);
}
