//Establece un tipo base para los modelos del dominio
export interface BaseModel {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
}
