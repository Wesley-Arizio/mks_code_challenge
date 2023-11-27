import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  title: string;

  @Column({ type: 'text' })
  description: string;
}
