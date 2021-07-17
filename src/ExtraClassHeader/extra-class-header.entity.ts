import { ExtraClassDetail } from "src/ExtraClassDetail/extra-class-detail.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class ExtraClassHeader {
    @PrimaryColumn()
    ExtraClassId: string

    @Column()
    SemesterId: string

    @Column()
    Course: string

    @Column({ length: 50 })
    Class: string

    @Column()
    TotalStudent: number

    @Column({
        length: 20
    })
    Assistant1: string
    
    @Column({
        default: null,
        length: 20
    })
    Assistant2: string
    
    @Column("text")
    Topics: string
    
    @Column({default: null, length: 50})
    Room: string
    
    @Column({
        type: 'varchar',
        length: 500
    })
    LinkZoom: string
    
    @Column({
        type: 'varchar',
        length: 500
    })
    LinkRecord: string
    
    @Column('date')
    ExtraClassDate: Date

    @Column()
    Shift: number

    @Column('datetime', {default: null})
    StartAbsent: Date

    @OneToMany(type => ExtraClassDetail, detail => detail.header, 
        { cascade: true })
    details: ExtraClassDetail[]
};
