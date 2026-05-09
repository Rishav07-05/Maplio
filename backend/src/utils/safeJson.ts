export const safeJsonParse = (raw: string) => {
	try {
		return JSON.parse(raw)
	} catch (error) {
		const start = raw.indexOf('{')
		const end = raw.lastIndexOf('}')

		if (start !== -1 && end !== -1 && end > start) {
			const slice = raw.slice(start, end + 1)
			try {
				return JSON.parse(slice)
			} catch (innerError) {
				throw new Error('AI response was not valid JSON')
			}
		}

		throw new Error('AI response was not valid JSON')
	}
}
