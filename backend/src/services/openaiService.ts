import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { systemPrompt } from '../prompts/systemPrompt'

dotenv.config()

export const generateRoadmapFromAI = async (goal: string, level: string) => {
	if (!process.env.GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY is not configured')
	}

	const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
	const model = client.getGenerativeModel({
		model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
		systemInstruction: systemPrompt,
		generationConfig: {
			responseMimeType: 'application/json',
			temperature: 0.2,
		},
	})

	const prompt = `Goal: ${goal}\nLevel: ${level}`
	const result = await model.generateContent(prompt)
	const response = await result.response
	const content = response.text()

	if (!content) {
		throw new Error('Empty AI response')
	}

	return content
}
