export interface Posts {
  posts: Post[];
  comments: Comment[];
  users: User[];
}

export interface Comment {
  _id: string;
  post_id: string;
  author: string;
  author_photo: string;
  content: string;
  created_at: Date;
}

export interface Post {
  _id: string;
  title: string;
  images: string[];
  description: string;
  tags: string[];
  created_at: Date;
  last_read_at: Date;
  comments: number;
  likes: number;
  views: number;
  category: string;
  user_id: number;
  friendlyId?: string
}

export interface PostRequest extends Omit<Post, 'comments' | 'likes' | 'views' | 'friendlyId' | '_id'> {}

export interface User {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  photo: string;
  suscription?: boolean;
  role?: string;
}

export interface UserPost extends Omit<User, 'photo' | '_id'> {
  photo: File
}

export interface GoogleUser extends Omit<User, '_id'> {
  id: string
}


export interface CarrucelData {
  id: number,
  title: string,
  author: User,
  images: string[],
  created_at: string,
  last_read_at: string,
  description: string,
  category?: string
  user_id: number;
  friendlyId?: string
}

export interface responseData {
  _id: string,
  name: string,
  last_name: string,
  email: string,
  photo?: string,
  suscription: boolean,
  role: string,

}

export interface responseDataPosts {
  ok: boolean,
  page: number,
  posts: Array<Post>
}

export interface responseDataPostsByCategory extends Omit<responseDataPosts, 'page'> { }

 export enum Category {
  Negocios='Negocios',
  Tecnologia='Tecnología',
  testcategoria='test categoria',
  Cultura='Cultura',
  Salud='Salud',
  Cocina='Cocina',
  Finanzas='Finanzas',
  DesarrolloPersonal='Desarrollo Personal',
  Educacion='Educación'
} 