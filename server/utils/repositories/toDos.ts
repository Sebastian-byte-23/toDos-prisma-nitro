interface ToDo {
	id: string
	title: string
	completed: boolean
}

type ToDoParcial = Partial<Omit<ToDo, 'id'>> & Pick<ToDo, 'id'>

const toDos: ToDo[] = []