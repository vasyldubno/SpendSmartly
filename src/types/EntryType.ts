export interface Entry {
	amount: number
	description: string
	category: string
	color: string
	id: string
	date: {
		seconds: number
		nanoseconds: number
	}
}
