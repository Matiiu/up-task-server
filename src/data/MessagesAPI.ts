import { taskStatus } from '../models/Task';

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
	NotBelongToTheProject = 'La tarea no pertenece al producto',
	MandatoryStatus = 'El estado es obligatorio',
	InvalidStatus = 'Estado no valido',
}

export enum TaskSuccessMsg {
	UpdatedTask = 'Tarea actualizada con éxito',
	DeletedTask = 'Tare eliminada con éxito',
}
