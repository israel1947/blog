export interface Posts {
  posts: Post[];
  comments: Comment[];
  users: User[];
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  author_photo: string;
  content: string;
  created_at: Date;
}

export interface Post {
  id: number;
  title: string;
  image: string;
  description: string;
  tags: string[];
  created_at: Date;
  last_read_at: Date;
  comments: number;
  likes: number;
  views: number;
  category: string;
  user_id: number;
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  photo: string;
}

export interface GoogleUser extends Omit<User, 'id'>{
  id:string
}


export interface CarrucelData {
  id: number,
  title: string,
  author: User,
  image: string,
  created_at: string,
  last_read_at: string,
  description: string,
  category?: string
  user_id: number;
}

export interface responseData {
  id: string,
  name: string,
  last_name: string,
  email: string,
  photo: string,
}

