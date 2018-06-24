import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn
} from 'typeorm';

@Entity()
export class Notes {
    @PrimaryColumn()
    userId!: string;

    @Column()
    noteId!: string; 
    
    @Column()
    content!: string;

    @Column('timestamp')
    createdAt!: Date;
}