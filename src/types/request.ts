export type Pagination = {
	currPage?: number,
	pageNum?: number,
	pageSize: number,
	year?: number,
	keywords?: string,
	category?: string[],
	firstLevelDiscipline?: string[],
	province?: string[],
	nineHundred?: string,
	twoEleven?: string,
	selfLineation?: string,
	initiative?: string,
	total?: number
}

export type PageData<T> = {
	totalCount: number,
	totalPage: number,
	list: Array<T>
}