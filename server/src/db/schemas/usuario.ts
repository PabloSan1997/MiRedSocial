import {Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import { Texto } from './textos';


@Entity()
export class Usuario{
    @PrimaryColumn()
    id_usuario:string;

    @Column()
    nombre:string;

    @Column({unique:true})
    email:string;

    @Column()
    contra:string;

    @Column()
    superUsuario:boolean;

    @OneToMany(()=>Texto, (texto) => texto.usuario)
    photos:Texto[]

}