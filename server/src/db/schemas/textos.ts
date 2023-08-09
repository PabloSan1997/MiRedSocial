import {Entity, Column, PrimaryColumn, ManyToOne} from 'typeorm';
import { Usuario } from './usuario';


@Entity()
export class Texto{
    @PrimaryColumn()
    id_texto:string;

    @Column()
    mensaje:string;

    @Column()
    fecha:string;

    @ManyToOne(()=>Usuario, (usuario)=> usuario.id_usuario)
    usuario: Usuario;
}