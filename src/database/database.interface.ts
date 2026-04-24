export interface DatabaseInterface {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}
