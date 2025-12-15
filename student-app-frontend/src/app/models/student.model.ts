export interface Student {
  id?: number;
  name: string;
  nationalId?: string;
  birthdate: string;
  address?: string;
  city: string;
  class: string;
  gender: string;
  enrolled?: boolean;
  remarks?: string;
}
export interface User {
  firstName: string;
  lastName: string;
}//student.model.ts
