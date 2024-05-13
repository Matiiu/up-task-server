export enum ProjectErrorMsg {
	MissingProjectName = 'El nombre del proyecto es obligatorio',
	MissingClientName = 'El nombre del cliente es obligatorio',
	MissingDescription = 'La descripción del producto es obligatoria',
	IsNotMongoId = 'ID de producto no válido',
	ProductNotFound = 'Producto no encontrado',
}

export enum TaskErrorMsg {
	MissingTaskName = 'El nombre de la tarea es obligatoria',
	MissingDescription = 'La descripción de la tarea es obligatoria',
	IsNotMongoId = 'ID de tarea no válido',
	TaskNotFound = 'Tarea no encontrada',
	NotBelongToTheProduct = 'La tarea no pertenece al producto',
}
