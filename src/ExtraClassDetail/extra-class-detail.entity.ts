import { type } from "node:os";
import { ExtraClassHeader } from "src/ExtraClassHeader/extra-class-header.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class ExtraClassDetail {
    @PrimaryColumn()
    ExtraClassId: string

    @PrimaryColumn({length: 100})
    StudentId: string

    @Column('text')
    StudentName: string

    @ManyToOne(type => ExtraClassHeader, header => header.details, 
        { onDelete: 'CASCADE' })
    @JoinColumn([
        {name: "ExtraClassId", referencedColumnName: "ExtraClassId"}
    ])
    header?: ExtraClassHeader
};
